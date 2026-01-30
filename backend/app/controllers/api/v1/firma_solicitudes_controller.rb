class Api::V1::FirmaSolicitudesController < ApplicationController
  include Authenticable

  # GET /api/v1/firma_solicitudes
  def index
    # Obtener todas las solicitudes relacionadas con el usuario en una sola consulta
    ids_solicitudes = FirmaSolicitud
      .where('solicitante_id = :user_id OR firmante_id = :user_id', user_id: current_user.id)
      .pluck(:id)
      .uniq

    todas_solicitudes = FirmaSolicitud
      .includes(:expediente, :solicitante, :firmante)
      .where(id: ids_solicitudes)
      .order(created_at: :desc)

    render json: todas_solicitudes.as_json(
      include: [:expediente, :solicitante, :firmante]
    )
  end

  # POST /api/v1/firma_solicitudes
  def create
    expediente = Expediente.find_or_create_by(numero: params[:expediente_numero]) do |exp|
      exp.descripcion = params[:expediente_descripcion]
    end
    solicitud = FirmaSolicitud.new(
      solicitante: current_user,
      firmante_id: params[:firmante_id],
      expediente: expediente,
      documentos: params[:documentos],
      comentario: params[:comentario],
      estado_firma: :pendiente
    )
    if solicitud.save
      render json: solicitud.as_json(include: [:expediente, :firmante]), status: :created
    else
      render json: { errors: solicitud.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/firma_solicitudes/:id
  def update
    solicitud = FirmaSolicitud.find(params[:id])
    unless solicitud.firmante_id == current_user.id
      return render json: { error: 'Solo el firmante puede actualizar el estado' }, status: :forbidden
    end

    estado = params[:estado] || params.dig(:firma_solicitude, :estado)
    
    if estado.present? && FirmaSolicitud.estado_firmas.keys.include?(estado)
      solicitud.estado_firma = estado
      solicitud.save!
      render json: solicitud.as_json(include: [:expediente, :firmante, :solicitante])
    else
      render json: { error: 'Estado inválido. Los estados válidos son: ' + FirmaSolicitud.estado_firmas.keys.join(', ') }, 
             status: :unprocessable_entity
    end
  end
end

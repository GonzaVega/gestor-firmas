class Api::V1::FirmaSolicitudesController < ApplicationController
  include Authenticable

  # GET /api/v1/firma_solicitudes
  def index
    solicitudes = if current_user.solicitudes_recibidas.exists?
      current_user.solicitudes_recibidas.includes(:expediente, :solicitante)
    else
      current_user.solicitudes_enviadas.includes(:expediente, :firmante)
    end
    render json: solicitudes.as_json(include: [:expediente, :solicitante, :firmante])
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
      estado: :pendiente
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
    if params[:estado].present? && FirmaSolicitud.estados.keys.include?(params[:estado])
      solicitud.estado = params[:estado]
      solicitud.save!
      render json: solicitud
    else
      render json: { error: 'Estado inválido' }, status: :unprocessable_entity
    end
  end
end

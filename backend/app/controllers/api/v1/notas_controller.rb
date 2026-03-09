class Api::V1::NotasController < ApplicationController
  include Authenticable

  def index
    notas = Note.where('remitente_id = :uid OR destinatario_id = :uid', uid: current_user.id)
                .includes(:remitente, :destinatario)
                .order(created_at: :desc)

    render json: notas.map { |n|
      n.as_json.merge({
        remitente_nombre: n.remitente.nombre,
        destinatario_nombre: n.destinatario.nombre
      })
    }
  end

  def create
    nota = Note.new(note_params)
    nota.remitente = current_user
    nota.estado_destinatario = 'no_leida'
    nota.estado_remitente = 'pendiente'
    
    if nota.save
      render json: nota, status: :created
    else
      render json: { errors: nota.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    nota = Note.where('remitente_id = :uid OR destinatario_id = :uid', uid: current_user.id).find(params[:id])
    
    action = params[:action_type]
    
    begin
      case action
      when 'marcar_leida_destinatario'
        if nota.destinatario_id == current_user.id
          nota.marcar_leida_destinatario!
        else
          return render json: { error: 'Unauthorized action' }, status: :forbidden
        end
      when 'responder'
        if nota.destinatario_id == current_user.id
          nota.responder!(params[:respuesta])
        else
          return render json: { error: 'Unauthorized action' }, status: :forbidden
        end
      when 'marcar_leida_respuesta_remitente'
        if nota.remitente_id == current_user.id
          nota.marcar_leida_respuesta_remitente!
        else
          return render json: { error: 'Unauthorized action' }, status: :forbidden
        end
      else
        # Fallback a actualización estándar si es necesario
        nota.update!(note_params)
      end
      
      render json: nota
    rescue ActiveRecord::RecordInvalid => e
      render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Not found or unauthorized' }, status: :not_found
  end

  private

  def note_params
    params.permit(:expediente, :contenido, :destinatario_id, :respuesta)
  end
end

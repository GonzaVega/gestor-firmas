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
    nota.estado ||= 'no_leida'
    
    if nota.save
      render json: nota, status: :created
    else
      render json: { errors: nota.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    # Security: Ensure user is related to the note
    nota = Note.where('remitente_id = :uid OR destinatario_id = :uid', uid: current_user.id).find(params[:id])
    
    # Assign respondida_el automatically if a response is provided for the first time
    if note_params[:respuesta].present? && nota.respondida_el.nil?
      nota.respondida_el = Time.current
    end

    if nota.update(note_params)
       render json: nota
    else
       render json: { errors: nota.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Not found or unauthorized' }, status: :not_found
  end

  private

  def note_params
    params.permit(:expediente, :contenido, :estado, :destinatario_id, :respuesta, :respondida_el)
  end
end

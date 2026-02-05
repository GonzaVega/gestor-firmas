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
    params.permit(:expediente, :contenido, :estado, :destinatario_id)
  end
end

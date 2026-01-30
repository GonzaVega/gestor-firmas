class Api::V1::UsersController < ApplicationController
  include Authenticable

  # GET /api/v1/users
  def index
    users = User.select(:id, :nombre, :email, :rol)
    render json: users
  end

  # GET /api/v1/users/me
  def me
    render json: {
      id: current_user.id,
      email: current_user.email,
      nombre: current_user.nombre,
      rol: current_user.rol
    }
  end

  # PATCH /api/v1/users/:id
  def update
    user = User.find(params[:id])
    if user.update(rol: params[:rol])
      render json: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
end

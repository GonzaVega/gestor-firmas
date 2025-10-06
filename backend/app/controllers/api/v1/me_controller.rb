class Api::V1::MeController < ApplicationController
  include Authenticable

  def show
    render json: {
      id: current_user.id,
      nombre: current_user.nombre,
      email: current_user.email,
      rol: current_user.rol
    }
  end
end

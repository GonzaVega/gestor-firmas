class Api::V1::AuthController < ApplicationController
  require 'jwt'
  # skip_before_action :verify_authenticity_token

  # POST /api/v1/auth/google
  def google
    id_token = params[:id_token]
    if id_token.blank?
      return render json: { error: 'id_token missing' }, status: :bad_request
    end

    # Verificar el token con la API de Google
    validator = GoogleIDToken::Validator.new
    begin
      payload = validator.check(id_token, ENV['GOOGLE_CLIENT_ID'])
    rescue => e
      return render json: { error: 'Invalid Google token', detail: e.message }, status: :unauthorized
    end

    user = User.from_google(payload)
    token = jwt_encode(user_id: user.id)
    render json: { jwt: token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } }
  end

  private
  def jwt_encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, ENV['JWT_SECRET'])
  end
end

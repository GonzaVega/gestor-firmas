class Api::V1::RolesController < ApplicationController
  include Authenticable

  # GET /api/v1/roles
  def index
    roles = [
      'Fiscal Jefe',
      'Fiscal',
      'Secretario Jefatura',
      'Secretario',
      'Prosecretario',
      'Auxiliar',
      'Auxiliar Mesa Entrada',
      'Jefe Mesa de Entrada'
    ]
    render json: roles
  end
end

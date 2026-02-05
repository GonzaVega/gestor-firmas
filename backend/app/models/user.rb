class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  def self.from_google(id_token_info)
    user = find_or_initialize_by(email: id_token_info['email'])
    user.nombre = id_token_info['name'] if user.nombre.blank?
    user.provider = 'google_oauth2'
    user.uid = id_token_info['sub']
    user.rol ||= 'Fiscal' # Rol por defecto
    user.password = Devise.friendly_token[0, 20] if user.encrypted_password.blank?
    user.save!
    user
  end

  has_many :solicitudes_enviadas, class_name: 'FirmaSolicitud', foreign_key: 'solicitante_id', dependent: :nullify
  has_many :solicitudes_recibidas, class_name: 'FirmaSolicitud', foreign_key: 'firmante_id', dependent: :nullify

  has_many :notas_enviadas, class_name: 'Note', foreign_key: 'remitente_id', dependent: :destroy
  has_many :notas_recibidas, class_name: 'Note', foreign_key: 'destinatario_id', dependent: :destroy
  has_many :tareas_creadas, class_name: 'Task', foreign_key: 'created_by_id', dependent: :destroy
  has_many :task_assignments, dependent: :destroy
  has_many :tareas_asignadas, through: :task_assignments, source: :task

  validates :email, presence: true, uniqueness: true
  validates :nombre, presence: true
  validates :rol, presence: true
end

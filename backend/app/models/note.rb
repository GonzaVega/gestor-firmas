class Note < ApplicationRecord
  belongs_to :remitente, class_name: 'User'
  belongs_to :destinatario, class_name: 'User'

  validates :contenido, presence: true
  validates :expediente, presence: true
  validates :estado, presence: true
end

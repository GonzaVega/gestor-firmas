class FirmaSolicitud < ApplicationRecord
	belongs_to :solicitante, class_name: 'User'
	belongs_to :firmante, class_name: 'User'
	belongs_to :expediente

	enum estado: { pendiente: 0, firmado: 1, rechazado: 2 }

	validates :solicitante_id, :firmante_id, :expediente_id, :documentos, :estado, presence: true
end

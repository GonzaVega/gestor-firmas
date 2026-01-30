class FirmaSolicitud < ApplicationRecord
	self.table_name = 'firma_solicitudes'
	
	belongs_to :solicitante, class_name: 'User'
	belongs_to :firmante, class_name: 'User'
	belongs_to :expediente

	enum :estado_firma, { pendiente: 0, firmado: 1, rechazado: 2 }, default: :pendiente

	validates :solicitante_id, :firmante_id, :expediente_id, :documentos, presence: true
end

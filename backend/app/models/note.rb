class Note < ApplicationRecord
  belongs_to :remitente, class_name: 'User'
  belongs_to :destinatario, class_name: 'User'

  enum :estado_destinatario, { no_leida: 'no_leida', leida: 'leida', archivada: 'archivada' }, prefix: :destinatario
  enum :estado_remitente, { pendiente: 'pendiente', respuesta_no_leida: 'respuesta_no_leida', archivada: 'archivada' }, prefix: :remitente

  validates :contenido, presence: true
  validates :expediente, presence: true
  validates :estado_destinatario, presence: true
  validates :estado_remitente, presence: true
  validate :prevent_multiple_responses, on: :update

  def marcar_leida_destinatario!
    if destinatario_no_leida?
      update!(
        estado_destinatario: 'leida',
        estado_remitente: 'archivada' # Archiva lado A si B solo lee sin responder
      )
    end
  end

  def responder!(texto)
    update!(
      respuesta: texto,
      respondida_el: Time.current,
      estado_destinatario: 'archivada',
      estado_remitente: 'respuesta_no_leida'
    )
  end

  def marcar_leida_respuesta_remitente!
    update!(estado_remitente: 'archivada') if remitente_respuesta_no_leida?
  end

  private

  def prevent_multiple_responses
    if respuesta_changed? && respuesta_was.present?
      errors.add(:respuesta, 'ya fue enviada y no puede modificarse.')
    end
  end
end

class Expediente < ApplicationRecord
	has_many :firma_solicituds, dependent: :destroy

	# Formato: P-######/## (P-, hasta 6 dígitos, /, 2 dígitos)
	VALID_FORMAT = /\AP-\d{1,6}\/\d{2}\z/
	validates :numero, presence: true, format: { with: VALID_FORMAT, message: 'debe tener formato P-######/##' }
end

class RenameEstadoToEstadoFirmaInFirmaSolicituds < ActiveRecord::Migration[8.0]
  def change
    rename_column :firma_solicitudes, :estado, :estado_firma
  end
end

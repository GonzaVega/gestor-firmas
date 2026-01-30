class RenameTableFirmaSolicitudsToFirmaSolicitudes < ActiveRecord::Migration[8.0]
  def change
    rename_table :firma_solicituds, :firma_solicitudes
  end
end

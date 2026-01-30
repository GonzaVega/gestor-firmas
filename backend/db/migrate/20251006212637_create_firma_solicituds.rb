class CreateFirmaSolicituds < ActiveRecord::Migration[8.0]
  def change
    create_table :firma_solicitudes do |t|
      t.integer :solicitante_id, null: false
      t.integer :firmante_id, null: false
      t.integer :expediente_id, null: false
      t.json :documentos, null: false
      t.text :comentario
      t.integer :estado, null: false, default: 0

      t.timestamps
    end

    add_index :firma_solicitudes, :solicitante_id
    add_index :firma_solicitudes, :firmante_id
    add_index :firma_solicitudes, :expediente_id
    add_foreign_key :firma_solicitudes, :users, column: :solicitante_id
    add_foreign_key :firma_solicitudes, :users, column: :firmante_id
    add_foreign_key :firma_solicitudes, :expedientes, column: :expediente_id
  end
end

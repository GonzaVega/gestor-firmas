class CreateFirmaSolicituds < ActiveRecord::Migration[8.0]
  def change
    create_table :firma_solicituds do |t|
      t.integer :solicitante_id, null: false
      t.integer :firmante_id, null: false
      t.integer :expediente_id, null: false
      t.json :documentos, null: false
      t.text :comentario
      t.integer :estado, null: false, default: 0

      t.timestamps
    end

    add_index :firma_solicituds, :solicitante_id
    add_index :firma_solicituds, :firmante_id
    add_index :firma_solicituds, :expediente_id
    add_foreign_key :firma_solicituds, :users, column: :solicitante_id
    add_foreign_key :firma_solicituds, :users, column: :firmante_id
    add_foreign_key :firma_solicituds, :expedientes, column: :expediente_id
  end
end

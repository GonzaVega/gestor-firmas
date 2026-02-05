class CreateNotes < ActiveRecord::Migration[8.0]
  def change
    create_table :notes do |t|
      t.string :expediente
      t.text :contenido
      t.string :estado, default: 'no_leida'
      t.references :remitente, null: false, foreign_key: { to_table: :users }
      t.references :destinatario, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end

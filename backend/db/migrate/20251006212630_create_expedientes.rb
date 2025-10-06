class CreateExpedientes < ActiveRecord::Migration[8.0]
  def change
    create_table :expedientes do |t|
      t.string :numero
      t.string :descripcion

      t.timestamps
    end
  end
end

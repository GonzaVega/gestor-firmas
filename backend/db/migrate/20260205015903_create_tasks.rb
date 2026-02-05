class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :expediente
      t.text :descripcion
      t.datetime :fecha_limite
      t.string :estado, default: 'pendiente'
      t.references :created_by, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end

class AddRespuestaToNotes < ActiveRecord::Migration[8.0]
  def change
    add_column :notes, :respuesta, :text
    add_column :notes, :respondida_el, :datetime
  end
end

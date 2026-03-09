class UpdateEstadosInNotes < ActiveRecord::Migration[8.0]
  def change
    add_column :notes, :estado_destinatario, :string, default: "no_leida"
    add_column :notes, :estado_remitente, :string, default: "pendiente"
    
    # Backfill para mantener la compatibilidad con datos existentes
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE notes
          SET 
            estado_destinatario = CASE 
                                    WHEN estado = 'no_leida' THEN 'no_leida'
                                    ELSE 'leida'
                                  END,
            estado_remitente = CASE
                                 WHEN respondida_el IS NOT NULL THEN 'respuesta_no_leida'
                                 ELSE 'pendiente'
                               END;
        SQL
      end
    end
    
    remove_column :notes, :estado, :string
  end
end

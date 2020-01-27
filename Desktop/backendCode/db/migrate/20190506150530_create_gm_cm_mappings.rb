class CreateGmCmMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :gm_cm_mappings do |t|
      t.references :gm, index: true, foreign_key: {to_table: :users}
      t.references :cm, index: true, foreign_key: {to_table: :users}

      t.timestamps

      t.index [:gm_id, :cm_id], unique: true
    end
  end
end

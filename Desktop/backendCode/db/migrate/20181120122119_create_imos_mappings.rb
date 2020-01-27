class CreateImosMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :imos_mappings do |t|
      t.string :imos_code
      t.string :mapping_type
      t.string :sli_group_code

      t.timestamps
    end

    add_index :imos_mappings, [:imos_code, :mapping_type], unique: true
  end
end

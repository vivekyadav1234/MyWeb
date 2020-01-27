class ChangeImosMappingImosCodeIndex < ActiveRecord::Migration[5.0]
  def change
    remove_index :imos_mappings, name: :index_imos_mappings_on_imos_code_and_mapping_type
    add_index :imos_mappings, :imos_code, unique: true
  end
end

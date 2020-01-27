class AddMappingTypeToShutterMaterialFinishes < ActiveRecord::Migration[5.0]
  def change
    add_column :shutter_material_finishes, :mapping_type, :string, null: false, default: 'arrivae'
    add_index :shutter_material_finishes, [:mapping_type, :core_material_id, :shutter_finish_id], unique: true, name: 'on_type_core_finish'
  end
end

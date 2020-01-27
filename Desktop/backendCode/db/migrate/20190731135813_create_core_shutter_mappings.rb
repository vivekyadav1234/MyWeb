class CreateCoreShutterMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :core_shutter_mappings do |t|
      t.string :mapping_type, null: false, default: 'arrivae'
      t.references :core_material, index: true, foreign_key: true
      t.references :shutter_material, index: true, foreign_key: { to_table: :core_materials }

      t.timestamps
    end

    add_index :core_shutter_mappings, [:mapping_type, :core_material_id, :shutter_material_id], unique: true, name: 'index_type_core_shutter'
  end
end

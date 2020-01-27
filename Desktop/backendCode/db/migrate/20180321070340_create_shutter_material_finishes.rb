class CreateShutterMaterialFinishes < ActiveRecord::Migration[5.0]
  def change
    create_table :shutter_material_finishes do |t|
      t.references :core_material, index: true, foreign_key: true
      t.references :shutter_finish, index: true, foreign_key: true

      t.timestamps
    end
  end
end

class CreateShangpinCoreMaterials < ActiveRecord::Migration[5.0]
  def change
    create_table :shangpin_core_materials do |t|
      t.string :core_material
      t.timestamps
    end
  end
end

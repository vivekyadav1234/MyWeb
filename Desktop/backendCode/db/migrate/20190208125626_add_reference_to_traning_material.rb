class AddReferenceToTraningMaterial < ActiveRecord::Migration[5.0]
  def change
    add_reference :training_materials, :training_material, index: true, foreign_key: {to_table: :training_materials}
    remove_column :training_materials, :parent_id
  end
end

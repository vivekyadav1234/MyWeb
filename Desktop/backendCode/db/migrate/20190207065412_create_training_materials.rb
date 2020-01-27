class CreateTrainingMaterials < ActiveRecord::Migration[5.0]
  def change
    create_table :training_materials do |t|
      t.string :category_name
      t.integer :created_by, index: true, foreign_key: {to_table: :users}
      t.integer :parent_id, index: true, foreign_key: {to_table: :training_materials}
      t.timestamps
    end
  end
end

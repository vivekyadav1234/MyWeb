class CreateCreateServiceSubcategories < ActiveRecord::Migration[5.0]
  def change
    create_table :service_subcategories do |t|
      t.string :name

      t.references :service_category, index: true, foreign_key: true

      t.timestamps
    end

    add_index :service_subcategories, :name, unique: true
  end
end

class CreateCatalogClasses < ActiveRecord::Migration[5.0]
  def change
    create_table :catalog_classes do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :catalog_classes, :name, unique: true
  end
end

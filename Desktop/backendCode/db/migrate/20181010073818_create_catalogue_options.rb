class CreateCatalogueOptions < ActiveRecord::Migration[5.0]
  def change
    create_table :catalogue_options do |t|
      t.string :name
      t.references :master_sub_option
      t.float :minimum_price
      t.float :maximum_price

      t.timestamps
    end
  end
end

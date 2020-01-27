class AddUrbanLadderColumnsToProducts < ActiveRecord::Migration[5.0]
  def change
    remove_reference :products, :business_unit, index: true, foreign_key: true

    add_column :products, :origin, :string, null: false, default: 'arrivae'
    add_column :products, :imported_sku, :string
    add_column :products, :last_imported_at, :datetime
  end
end

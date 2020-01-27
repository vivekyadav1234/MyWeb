class RenameTypeInSpecifications < ActiveRecord::Migration[5.0]
  def change
    # rename_column :specifications, :type, :specification_type
    # change_column :specifications, :price_cents, :integer, default: 0
    change_column :price_configurators, :total_price_cents,:integer, default: 0
  end
end

class DropSpecifications < ActiveRecord::Migration[5.0]
  def change
    if table_exists?("price_specifications")
      drop_table :price_specifications
    elsif table_exists?("specifications")
        drop_table :specifications
    end
  end
end

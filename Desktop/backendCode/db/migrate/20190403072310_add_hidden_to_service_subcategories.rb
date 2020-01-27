class AddHiddenToServiceSubcategories < ActiveRecord::Migration[5.0]
  def change
    add_column(:service_subcategories, :hidden, :boolean, null: false, default: false) unless column_exists?(:service_subcategories, :hidden)
  end
end

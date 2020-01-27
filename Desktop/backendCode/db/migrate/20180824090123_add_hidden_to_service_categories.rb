class AddHiddenToServiceCategories < ActiveRecord::Migration[5.0]
  def change
  	add_column :service_categories, :hidden, :boolean, default: false
  end
end

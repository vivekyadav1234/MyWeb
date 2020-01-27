class AddGolaProfileColumnsToTables < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :c_section_length, :integer, default: 0
    add_column :product_modules, :l_section_length, :integer, default: 0
    add_column :product_modules, :c_section_number, :integer, default: 0
    add_column :product_modules, :l_section_number, :integer, default: 0

    add_column :modular_jobs, :gola_profile, :boolean, default: false
  end
end

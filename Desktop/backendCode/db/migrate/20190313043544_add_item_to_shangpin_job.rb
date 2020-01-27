class AddItemToShangpinJob < ActiveRecord::Migration[5.0]
  def change
    add_column :shangpin_jobs, :cabinet_item, :string
    add_column :shangpin_jobs, :cabinet_color, :string
    add_column :shangpin_jobs, :door_item, :string
    add_column :shangpin_jobs, :door_color, :string
    add_column :shangpin_jobs, :door_model_no, :string
    add_column :shangpin_jobs, :door_price, :string
    add_column :shangpin_jobs, :accessory_item, :string
    add_column :shangpin_jobs, :accessory_color, :string
    add_column :shangpin_jobs, :accessory_model_no, :string
  end
end

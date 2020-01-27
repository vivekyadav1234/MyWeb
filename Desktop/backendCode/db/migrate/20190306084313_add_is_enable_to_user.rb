class AddIsEnableToUser < ActiveRecord::Migration[5.0]
  def change
  	add_column :users, :is_cm_enable, :boolean, default: true
  end
end

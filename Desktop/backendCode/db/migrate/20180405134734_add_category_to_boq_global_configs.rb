class AddCategoryToBoqGlobalConfigs < ActiveRecord::Migration[5.0]
  def change
    add_column :boq_global_configs, :category, :string
  end
end

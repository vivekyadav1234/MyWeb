class AddPercent18ReductionToProductModules < ActiveRecord::Migration[5.0]
  def change
    add_column :product_modules, :percent_18_reduction, :boolean, default: false
  end
end

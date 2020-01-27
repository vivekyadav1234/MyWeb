class AddCountertopCostToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :countertop_cost, :float
  end
end

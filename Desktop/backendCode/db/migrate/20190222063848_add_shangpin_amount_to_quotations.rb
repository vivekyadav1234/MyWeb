class AddShangpinAmountToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :shangpin_amount, :float, default: 0
  end
end

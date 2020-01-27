class AddPriceIncreaseFactorToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :price_increase_factor, :float, default: 1.0
  end
end

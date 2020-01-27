class ChangeLeadTimeInProductsToInteger < ActiveRecord::Migration[5.0]
  def change
    remove_column :products, :lead_time, :string
    add_column :products, :lead_time, :integer
  end
end

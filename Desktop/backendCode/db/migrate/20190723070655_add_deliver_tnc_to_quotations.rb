class AddDeliverTncToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :delivery_tnc, :text
  end
end

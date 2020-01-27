class AddDiscountToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :discount_value, :float
    add_column :quotations, :discount_status, :string
    add_column :quotations, :disc_status_updated_at, :datetime
    add_column :quotations, :disc_status_updated_by, :integer
    add_column :quotations, :final_amount, :float
    add_column :quotations, :is_approved, :boolean
  end
end

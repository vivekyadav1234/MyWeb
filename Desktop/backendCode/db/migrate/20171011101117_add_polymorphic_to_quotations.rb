class AddPolymorphicToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :quotationable_id, :integer
    add_column :quotations, :quotationable_type, :string
  end
end

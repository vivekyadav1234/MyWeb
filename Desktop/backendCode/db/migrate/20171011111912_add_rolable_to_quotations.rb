class AddRolableToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :rolable_id, :integer
    add_column :quotations, :rolable_type, :string
  end
end

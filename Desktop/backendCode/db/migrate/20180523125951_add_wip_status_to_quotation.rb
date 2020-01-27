class AddWipStatusToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :wip_status, :string
    add_column :quotations, :approved_by, :integer
    add_column :quotations, :approved_at, :datetime
  end
end

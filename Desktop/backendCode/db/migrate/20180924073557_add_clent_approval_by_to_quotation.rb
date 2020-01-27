class AddClentApprovalByToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :client_approval_by_id, :integer
    add_column :quotations, :client_approval_at, :datetime
  end
end

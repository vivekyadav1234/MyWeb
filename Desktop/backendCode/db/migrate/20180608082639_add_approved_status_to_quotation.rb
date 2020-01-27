class AddApprovedStatusToQuotation < ActiveRecord::Migration[5.0]
  def change
    remove_column :quotations, :approved_by
    remove_column :quotations, :approved_at
    add_reference :quotations, :per_10_approved_by, index: true, foreign_key: { to_table: :users }
    add_column :quotations, :per_10_approved_at, :datetime
    add_reference :quotations, :per_50_approved_by, index: true, foreign_key: { to_table: :users }
    add_column :quotations, :per_50_approved_at, :datetime
    add_reference :quotations, :category_appoval_by, index: true, foreign_key: { to_table: :users }
    add_column :quotations, :category_appoval_at, :datetime

  end
end

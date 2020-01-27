class ChangeColumnNamesDiscountStatusUpdate < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :cm_approval_at, :datetime
    add_reference :quotations, :cm_approval_by, index: true, foreign_key: { to_table: :users }
    add_column :quotations, :cm_approval, :boolean, default: false
    add_column :quotations, :category_approval, :boolean, default: false
  end
end

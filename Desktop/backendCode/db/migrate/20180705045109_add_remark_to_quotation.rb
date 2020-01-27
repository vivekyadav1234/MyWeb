class AddRemarkToQuotation < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :remark, :text
  end
end

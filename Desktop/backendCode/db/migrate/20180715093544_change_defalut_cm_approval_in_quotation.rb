class ChangeDefalutCmApprovalInQuotation < ActiveRecord::Migration[5.0]
  def change
  	change_column_default(:quotations, :cm_approval, nil)
  	change_column_default(:quotations, :category_approval, nil)
  end
end

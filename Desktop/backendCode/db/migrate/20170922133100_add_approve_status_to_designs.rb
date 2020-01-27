class AddApproveStatusToDesigns < ActiveRecord::Migration[5.0]
  def change
    add_column :designs, :status, :integer, default: 0
  end
end

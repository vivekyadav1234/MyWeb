class AddNeedApprovalToShare < ActiveRecord::Migration[5.0]
  def self.up
    add_column :quotations, :need_category_apploval, :boolean
  end

  def self.down
    remove_column :quotations, :need_category_apploval
  end
end

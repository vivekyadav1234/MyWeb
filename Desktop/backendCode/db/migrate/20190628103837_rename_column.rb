class RenameColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :quotations, :need_category_apploval, :need_category_approval
  end
end

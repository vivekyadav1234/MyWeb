class ChangeColumnInternalDefault < ActiveRecord::Migration[5.0]
  def change
    change_column :users, :internal, :boolean, default: false
  end
end

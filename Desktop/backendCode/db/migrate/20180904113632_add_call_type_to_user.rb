class AddCallTypeToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :call_type, :string
  end
end

class AddHandleClassToHandles < ActiveRecord::Migration[5.0]
  def change
    add_column :handles, :handle_class, :string, null: false, default: 'normal'
  end
end

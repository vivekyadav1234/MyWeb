class AddStatusToCustomElements < ActiveRecord::Migration[5.0]
  def change
    add_column :custom_elements, :status, :string, default: "pending"
  end
end

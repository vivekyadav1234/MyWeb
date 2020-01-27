class AddColumnToInhouse < ActiveRecord::Migration[5.0]
  def change
    add_column :inhouse_calls, :contact_type, :string, default: "call"
  end
end

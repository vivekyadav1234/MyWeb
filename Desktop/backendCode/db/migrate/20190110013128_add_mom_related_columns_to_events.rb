class AddMomRelatedColumnsToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :mom_status, :string, default: "pending"
    add_column :events, :mom_description, :text
  end
end

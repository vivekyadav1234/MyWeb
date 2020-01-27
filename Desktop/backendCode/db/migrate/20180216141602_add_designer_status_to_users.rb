class AddDesignerStatusToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :designer_status, :string, default: 'not_applicable'
  end
end

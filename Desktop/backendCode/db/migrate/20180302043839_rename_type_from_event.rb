class RenameTypeFromEvent < ActiveRecord::Migration[5.0]
  def change
  	rename_column :events, :type, :contact_type
  end
end

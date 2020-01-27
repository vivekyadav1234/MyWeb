class AddContactToFbLeadgens < ActiveRecord::Migration[5.0]
  def change
    add_column :fb_leadgens, :contact, :string
  end
end

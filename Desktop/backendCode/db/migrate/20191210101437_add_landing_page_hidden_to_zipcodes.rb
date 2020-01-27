class AddLandingPageHiddenToZipcodes < ActiveRecord::Migration[5.0]
  def change
    add_column :zipcodes, :landing_page_hidden, :boolean, null: false, default: false
  end
end

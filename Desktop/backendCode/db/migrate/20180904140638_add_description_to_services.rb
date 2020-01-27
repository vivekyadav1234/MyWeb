class AddDescriptionToServices < ActiveRecord::Migration[5.0]
  def change
    add_column :service_activities, :description, :string
  end
end

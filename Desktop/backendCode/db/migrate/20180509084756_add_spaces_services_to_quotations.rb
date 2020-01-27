class AddSpacesServicesToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :spaces_services, :text, array: true, default: []
  end
end

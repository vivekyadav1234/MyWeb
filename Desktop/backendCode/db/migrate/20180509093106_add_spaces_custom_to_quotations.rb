class AddSpacesCustomToQuotations < ActiveRecord::Migration[5.0]
  def change
  	add_column :quotations, :spaces_custom, :text, array: true, default: []
  end
end

class AddSpacesLooseToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :spaces_loose, :text, array: true, default: []
  end
end

class AddSpacesCustomFurnitureToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :spaces_custom_furniture, :string, array: true, default: []
  end
end

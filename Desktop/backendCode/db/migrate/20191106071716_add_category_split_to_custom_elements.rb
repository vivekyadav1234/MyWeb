class AddCategorySplitToCustomElements < ActiveRecord::Migration[5.0]
  def change
    add_column :custom_elements, :category_split, :string
  end
end

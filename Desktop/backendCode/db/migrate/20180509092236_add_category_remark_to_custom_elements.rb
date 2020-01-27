class AddCategoryRemarkToCustomElements < ActiveRecord::Migration[5.0]
  def change
    add_column :custom_elements, :category_remark, :text
    rename_column :custom_elements, :remark, :designer_remark
  end
end

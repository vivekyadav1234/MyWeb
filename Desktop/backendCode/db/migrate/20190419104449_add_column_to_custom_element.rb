class AddColumnToCustomElement < ActiveRecord::Migration[5.0]
  def change
    add_column :custom_elements, :space, :string
  end
end

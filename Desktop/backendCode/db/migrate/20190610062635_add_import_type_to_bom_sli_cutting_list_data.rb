class AddImportTypeToBomSliCuttingListData < ActiveRecord::Migration[5.0]
  def change
    add_column :bom_sli_cutting_list_data, :import_type, :string
  end
end

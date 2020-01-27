class AddImosSheetAndRow < ActiveRecord::Migration[5.0]
  def change
    remove_column :job_elements, :imos_info, :string
    add_column :job_elements, :imos_sheet, :string
    add_column :job_elements, :imos_row, :integer
  end
end

class AddImportTypeToJobElements < ActiveRecord::Migration[5.0]
  def change
    remove_column :job_elements, :imos_upload, :boolean, null: false, default: false
    add_column :job_elements, :import_type, :string
  end
end

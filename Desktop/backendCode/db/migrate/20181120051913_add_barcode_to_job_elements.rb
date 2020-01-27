class AddBarcodeToJobElements < ActiveRecord::Migration[5.0]
  def change
    add_column :job_elements, :barcode, :string
    add_column :job_elements, :imos_upload, :boolean, default: false
  end
end

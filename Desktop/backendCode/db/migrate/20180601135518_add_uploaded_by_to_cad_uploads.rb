class AddUploadedByToCadUploads < ActiveRecord::Migration[5.0]
  def change
    add_reference :cad_uploads, :uploaded_by, index: true, foreign_key: { to_table: :users }
  end
end

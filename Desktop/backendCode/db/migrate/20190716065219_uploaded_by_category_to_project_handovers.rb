class UploadedByCategoryToProjectHandovers < ActiveRecord::Migration[5.0]
  def change
    add_column :project_handovers, :category_upload, :boolean, default: false
  end
end

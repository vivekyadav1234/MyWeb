class CreateCadUploads < ActiveRecord::Migration[5.0]
  def change
    create_table :cad_uploads do |t|
      t.string :upload_name
      t.string :upload_type
      t.string :status, default: 'pending'
      t.string :approval_comment
      t.datetime :status_changed_at

      t.attachment :upload

      t.references :quotation, index: true, foreign_key: true

      t.timestamps
    end

    add_index :cad_uploads, :status
  end
end

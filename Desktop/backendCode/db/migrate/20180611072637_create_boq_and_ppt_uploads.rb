class CreateBoqAndPptUploads < ActiveRecord::Migration[5.0]
  def change
    create_table :boq_and_ppt_uploads do |t|
      t.references :project, foreign_key: true
      t.attachment :upload
      t.string :upload_type
      t.boolean :shared_with_customer

      t.timestamps
    end
  end
end

class CreateCadUploadJobs < ActiveRecord::Migration[5.0]
  def change
    create_table :cad_upload_jobs do |t|
      t.references :cad_upload, index: true, foreign_key: true
      t.references :uploadable, polymorphic: true, index: true

      t.timestamps
    end
  end
end

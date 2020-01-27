class CreateSiteGalleries < ActiveRecord::Migration[5.0]
  def change
    create_table :site_galleries do |t|
      t.references :site_measurement_request, foreign_key: true
      t.attachment :site_image

      t.timestamps
    end
  end
end

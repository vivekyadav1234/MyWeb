class CreateDocumentsUrls < ActiveRecord::Migration[5.0]
  def change
    create_table :documents_urls do |t|
      t.text :url
      t.string :type_of_url

      t.timestamps
    end
  end
end

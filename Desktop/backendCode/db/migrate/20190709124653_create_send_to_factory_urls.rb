class CreateSendToFactoryUrls < ActiveRecord::Migration[5.0]
  def change
    create_table :send_to_factory_urls do |t|
      t.references :project, index: true, foreign_key: true
      t.references :content, index: true, foreign_key: true
      t.timestamps
    end
  end
end

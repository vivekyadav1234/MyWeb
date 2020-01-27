class CreateApiV1MediaPages < ActiveRecord::Migration[5.0]
  def change
    create_table :media_pages do |t|
      t.attachment :logo
      t.string :title
      t.string :description
      t.string :read_more_url
      t.timestamps
    end
  end
end

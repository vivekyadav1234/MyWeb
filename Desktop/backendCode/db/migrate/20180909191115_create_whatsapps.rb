class CreateWhatsapps < ActiveRecord::Migration[5.0]
  def change
    create_table :whatsapps do |t|
      t.string :to
      t.references :ownerable, polymorphic: true, index: true
      t.string :message
      t.json :response
      t.timestamps
    end
  end
end

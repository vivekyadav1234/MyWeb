class CreateContents < ActiveRecord::Migration[5.0]
  def change
    create_table :contents do |t|
      t.references :ownerable, polymorphic: true, index: true
      t.attachment :document
      t.string :scope
      t.timestamps null: false
    end
  end
end

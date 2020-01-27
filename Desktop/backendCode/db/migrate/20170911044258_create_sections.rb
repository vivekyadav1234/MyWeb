class CreateSections < ActiveRecord::Migration[5.0]
  def change
    create_table :sections do |t|
      t.string :name, null: false
      t.text :description
      t.timestamps
    end
  end
end

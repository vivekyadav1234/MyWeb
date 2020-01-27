class CreateAddonTags < ActiveRecord::Migration[5.0]
  def change
    create_table :addon_tags do |t|
      t.string :name, null: false

      t.timestamps
    end
  end
end

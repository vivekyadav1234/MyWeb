class CreateShades < ActiveRecord::Migration[5.0]
  def change
    create_table :shades do |t|
      t.string :name
      t.string :code

      t.attachment :shade_image

      t.timestamps
    end
  end
end

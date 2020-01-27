class CreateBrands < ActiveRecord::Migration[5.0]
  def change
    create_table :brands do |t|
      t.string :name

      t.boolean :hardware, default: true
      t.boolean :addon, default: true

      t.timestamps
    end
  end
end

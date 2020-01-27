class CreateSkirtingConfigs < ActiveRecord::Migration[5.0]
  def change
    create_table :skirting_configs do |t|
      t.string :skirting_type
      t.integer :skirting_height
      t.float :price

      t.timestamps
    end
  end
end

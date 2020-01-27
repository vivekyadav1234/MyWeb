class CreateMasterSubOptions < ActiveRecord::Migration[5.0]
  def change
    create_table :master_sub_options do |t|
      t.string :name
      t.references :master_option

      t.timestamps
    end
  end
end

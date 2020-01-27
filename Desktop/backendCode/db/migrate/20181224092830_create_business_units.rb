class CreateBusinessUnits < ActiveRecord::Migration[5.0]
  def change
    create_table :business_units do |t|
      t.string :unit_name, null: false

      t.timestamps
    end
  end
end

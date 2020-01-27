class CreateZipcodes < ActiveRecord::Migration[5.0]
  def change
    create_table :zipcodes do |t|
      t.string :code
      t.references :city,  index: true
      t.timestamps
    end
  end
end

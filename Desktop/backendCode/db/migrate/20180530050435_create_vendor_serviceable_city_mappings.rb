class CreateVendorServiceableCityMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :vendor_serviceable_city_mappings do |t|
      t.references :serviceable_city, index: true, foreign_key: { to_table: 'cities' }
      t.references :vendor, index: true
      t.timestamps
    end
  end
end

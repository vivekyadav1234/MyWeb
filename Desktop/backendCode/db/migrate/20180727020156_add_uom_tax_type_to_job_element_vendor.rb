class AddUomTaxTypeToJobElementVendor < ActiveRecord::Migration[5.0]
  def change
  	add_column :job_element_vendors, :unit_of_measurement, :string
  	add_column :job_element_vendors, :tax_type, :string
  end
end

class AddQualityCheckDateToJobElementVendors < ActiveRecord::Migration[5.0]
  def self.up
    add_column :job_elements, :qc_date, :string
  end

  def self.down
    remove_column :job_elements, :qc_date
  end
end

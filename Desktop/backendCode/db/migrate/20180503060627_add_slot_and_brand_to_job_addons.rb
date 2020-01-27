class AddSlotAndBrandToJobAddons < ActiveRecord::Migration[5.0]
  def change
  	add_column :job_addons, :slot, :string
  	add_reference :job_addons, :brand, index: true, foreign_key: true
  end
end

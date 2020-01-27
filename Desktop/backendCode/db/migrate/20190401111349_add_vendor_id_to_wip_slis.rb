class AddVendorIdToWipSlis < ActiveRecord::Migration[5.0]
  def change
    add_reference :wip_slis, :vendor, foreign_key: true
    add_column :wip_slis, :name, :string
    add_column :wip_slis, :unit, :string
    add_column :wip_slis, :rate, :float
  end
end

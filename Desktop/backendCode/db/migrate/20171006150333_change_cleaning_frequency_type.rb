class ChangeCleaningFrequencyType < ActiveRecord::Migration[5.0]
  def change
  	remove_column :price_configurators, :cleaning_frequency, :string
  	add_column :price_configurators, :cleaning_frequency, :integer, default: 0
  end
end

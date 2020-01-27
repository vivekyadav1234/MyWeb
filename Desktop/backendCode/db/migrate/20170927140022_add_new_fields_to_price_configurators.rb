class AddNewFieldsToPriceConfigurators < ActiveRecord::Migration[5.0]
  def change
    add_column :price_configurators, :food_type, :string
    add_column :price_configurators, :food, :string
    add_column :price_configurators, :family_size, :integer
    add_column :price_configurators, :utensil_used, :string
    add_column :price_configurators, :vegetable_cleaning, :string
    add_column :price_configurators, :cleaning_frequency, :string
    add_column :price_configurators, :storage_utensils, :string
    add_column :price_configurators, :kind_of_food, :string
    add_column :price_configurators, :size_of_utensils, :string
    add_column :price_configurators, :habit, :string
    add_column :price_configurators, :platform, :string
    add_column :price_configurators, :hob, :string
    add_column :price_configurators, :chimney, :string
    add_column :price_configurators, :chimney_type, :string
    add_column :price_configurators, :sink, :string
    add_column :price_configurators, :dustbin, :string
    add_column :price_configurators, :bowl_type, :string
    add_column :price_configurators, :drain_board, :integer
    add_column :price_configurators, :light, :string
  end
end

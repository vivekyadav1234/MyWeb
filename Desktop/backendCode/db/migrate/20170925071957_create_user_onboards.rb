class CreateUserOnboards < ActiveRecord::Migration[5.0]
  def change
    create_table :user_onboards do |t|
      t.references :user, foreign_key: true
      t.string :food_type
      t.string :food
      t.integer :family_size
      t.string :utensil_used
      t.string :vegetable_cleaning
      t.string :cleaning_frequency
      t.string :storage_utensils
      t.string :kind_of_food
      t.string :size_of_utensils
      t.string :habit
      t.string :platform
      t.string :hob
      t.string :chimney
      t.string :chimney_type
      t.string :sink
      t.string :dustbin
      t.string :bowl_type
      t.integer :drain_board
      t.string :light

      t.timestamps
    end
  end
end

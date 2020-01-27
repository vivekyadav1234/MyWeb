class CreateCarcassElementTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :carcass_element_types do |t|
      t.string :name
      t.string :category

      t.timestamps
    end

    add_reference :carcass_elements, :carcass_element_type, index: true, foreign_key: true
  end
end

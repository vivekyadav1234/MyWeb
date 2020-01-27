class CreateHardwareElementTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :hardware_element_types do |t|
      t.string :name
      t.string :category

      t.timestamps
    end

    add_reference :hardware_elements, :hardware_element_type, index: true, foreign_key: true
  end
end

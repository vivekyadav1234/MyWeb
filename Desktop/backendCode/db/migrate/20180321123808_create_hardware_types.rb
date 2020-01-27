class CreateHardwareTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :hardware_types do |t|
      t.string :name

      t.timestamps
    end

    add_reference :hardware_elements, :hardware_type, index: true, foreign_key: true
  end
end

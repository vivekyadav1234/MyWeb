class CreateDpqSections < ActiveRecord::Migration[5.0]
  def change
    create_table :dpq_sections do |t|
      t.string :section_name

      t.timestamps
    end
  end
end

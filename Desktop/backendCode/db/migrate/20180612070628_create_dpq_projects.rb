class CreateDpqProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :dpq_projects do |t|
      t.string :customer_name
      t.string :type
      t.string :budget
      t.string :area
      t.string :client_pitches_and_design_approval
      t.references :dpq_section, foreign_key: true

      t.timestamps
    end
  end
end

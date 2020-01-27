class CreateRequirementSheets < ActiveRecord::Migration[5.0]
  def change
    create_table :requirement_sheets do |t|
      t.references :project_requirement, foreign_key: true
      t.string :space_type
      t.string :space_name

      t.timestamps
    end
  end
end

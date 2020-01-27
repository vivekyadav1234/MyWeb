class CreateMilestones < ActiveRecord::Migration[5.0]
  def change
    create_table :milestones do |t|
      t.integer :milestone_object_id
      t.string :milestone_object_type
      t.string :percentage_amount
      t.string :interval

      t.timestamps
    end
  end
end

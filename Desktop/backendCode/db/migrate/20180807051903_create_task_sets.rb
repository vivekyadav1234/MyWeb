class CreateTaskSets < ActiveRecord::Migration[5.0]
  def change
    create_table :task_sets do |t|
      t.string :task_name
      t.string :duration_in_hr
      t.text :notify_to, array: true, default: []
      t.boolean :notify_by_email
      t.boolean :notify_by_sms
      t.boolean :optional
      t.string :stage

      t.timestamps
    end
  end
end

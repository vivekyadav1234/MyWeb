class AddEstimateDateToMilestones < ActiveRecord::Migration[5.0]
  def change
    add_column :milestones, :estimate_date, :datetime
  end
end

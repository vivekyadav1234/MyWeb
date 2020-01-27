class AddTagToShangpinJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :shangpin_jobs, :tag, foreign_key: true, null: true
  end
end

class AddJobCombinationIdToJobAddons < ActiveRecord::Migration[5.0]
  def change
    add_reference :job_addons, :addon_combination, index: true, foreign_key: true
  end
end

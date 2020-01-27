class AddAddonCombinationsReferenceToExtraJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :extra_jobs, :addon_combination, index: true, foreign_key: true
  end
end

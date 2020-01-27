class RemoveGolaProfileFromModularJobs < ActiveRecord::Migration[5.0]
  def change
    remove_column :modular_jobs, :gola_profile, :string
  end
end

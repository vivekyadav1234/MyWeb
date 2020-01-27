class AddSectionToModularJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :modular_jobs, :section, index: true, foreign_key: true
  end
end

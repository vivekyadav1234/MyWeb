class AddCompulsoryAddonJobIdToAddonJobs < ActiveRecord::Migration[5.0]
  def change
    add_reference :job_addons, :compulsory_job_addon, index: true, foreign_key: { to_table: :job_addons }
  end
end

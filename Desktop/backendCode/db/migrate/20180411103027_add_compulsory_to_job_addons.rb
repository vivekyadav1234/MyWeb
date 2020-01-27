class AddCompulsoryToJobAddons < ActiveRecord::Migration[5.0]
  def change
    add_column :job_addons, :compulsory, :boolean, default: false
  end
end

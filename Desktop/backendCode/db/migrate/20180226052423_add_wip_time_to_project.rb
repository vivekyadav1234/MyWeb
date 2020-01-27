class AddWipTimeToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :wip_time, :datetime
  end
end

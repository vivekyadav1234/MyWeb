class AddStatusToWipSli < ActiveRecord::Migration[5.0]
  def change
    add_column :wip_slis, :status, :string, default: "pending"
  end
end

class AddReasonForLostToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :reason_for_lost, :string
  end
end

class AddLeadIdToProjects < ActiveRecord::Migration[5.0]
  def change
    add_reference :projects, :lead, index: true, foreign_key: true
  end
end

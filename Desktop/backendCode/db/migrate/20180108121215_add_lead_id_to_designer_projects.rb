class AddLeadIdToDesignerProjects < ActiveRecord::Migration[5.0]
  def change
    add_reference :designer_projects, :lead, foreign_key: true
  end
end

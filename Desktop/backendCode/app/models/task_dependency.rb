# == Schema Information
#
# Table name: task_dependencies
#
#  project_task_id        :integer          not null
#  upstream_dependency_id :integer          not null
#

# join table
class TaskDependency < ApplicationRecord
  belongs_to :project_task
  belongs_to :upstream_dependency, class_name: 'ProjectTask'

  #prevent duplicate dependency
  validates_uniqueness_of :upstream_dependency_id, scope: [:project_task_id]
  validate :dependency_not_self

  private

  # A task can't have itself as a dependency
  def dependency_not_self
    return true unless project_task_id == upstream_dependency_id
    errors.add :upstream_dependency_id, "A task cannot have itself as a dependency."
  end
end

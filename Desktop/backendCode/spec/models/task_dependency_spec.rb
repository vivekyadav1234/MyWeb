# == Schema Information
#
# Table name: task_dependencies
#
#  project_task_id        :integer          not null
#  upstream_dependency_id :integer          not null
#

require 'rails_helper'

RSpec.describe TaskDependency, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

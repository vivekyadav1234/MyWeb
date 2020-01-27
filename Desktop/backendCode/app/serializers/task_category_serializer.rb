# == Schema Information
#
# Table name: task_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  project_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TaskCategorySerializer < ActiveModel::Serializer
  attributes :id, :name

  belongs_to :project

  has_many :project_tasks
end

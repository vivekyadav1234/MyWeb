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

class TaskCategory < ApplicationRecord
  belongs_to :project
  has_many :project_tasks

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:project_id]

  #rolify
  resourcify
end

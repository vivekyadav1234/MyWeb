# == Schema Information
#
# Table name: project_tasks
#
#  id                     :integer          not null, primary key
#  internal_name          :string           not null
#  name                   :string           not null
#  start_date             :date
#  end_date               :date
#  duration               :integer
#  percent_completion     :integer
#  upstream_dependency_id :integer
#  project_id             :integer
#  task_category_id       :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :integer
#  status                 :string
#  action_point           :string
#  process_owner          :string
#  remarks                :text
#

class ProjectTaskSerializer < ActiveModel::Serializer
  # attributes :id, :internal_name, :name, :start_date, :end_date, :duration, 
  # :percent_completion, :upstream_dependency_id, :project_id, :task_category_id

  attributes :id, :internal_name, :name, :status, :resource, :start, :end, :duration, :percentComplete, :percent_completion,
    :parentId, :project_id, :task_category_id, :parentId, :status, :action_point, :process_owner, :remarks, :start_date, :end_date

  attribute :actual_start
  attribute :actual_end
  attribute :customer_id
  attribute :upstream_dependencies
  attribute :downstream_dependencies

  # attribute :email

  belongs_to :project
  belongs_to :task_category
  belongs_to :user

  # has_many :upstream_dependencies
  # has_many :downstream_dependencies

  def upstream_dependencies
    object.upstream_dependencies.pluck(:name)&.join(",")
  end

  def downstream_dependencies
    object.downstream_dependencies.pluck(:name)&.join(",")
  end

  def internal_name
    object.internal_name
  end

  def name
    object.name
  end

  def resource
    object.user&.email
  end

  def parentId
    object.upstream_dependencies.first.id.to_s if object.upstream_dependencies.first.present?
  end

  def customer_id
    object&.project&.user&.id
  end
  
  # def email
  #   object.user&.email
  # end

  def percentComplete
    # object.percent_completion.to_i
    object.percent_completion.to_i >= 100 ? 100 : 0
  end

  def start
    Time.zone.parse(object.start_date.to_s) if object.start_date.present?
  end

  def end
    Time.zone.parse(object.end_date.to_s) if object.end_date.present?
  end

  def actual_start
    # if object.start_date.present?
    #   Time.zone.parse(object.start_date.to_s)
    # end
    Time.zone.parse(object.actual_start_date.to_s)
  end

  def actual_end
    puts object.inspect
    # Time.zone.parse(object.end_date.to_s) if object.end_date.present?
    Time.zone.parse(object.actual_end_date.to_s)
  end

end


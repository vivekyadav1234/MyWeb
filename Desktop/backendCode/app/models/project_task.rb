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

class ProjectTask < ApplicationRecord
  belongs_to :project
  belongs_to :task_category, optional: true
  belongs_to :user, optional: true

  has_many :task_dependencies, dependent: :delete_all
  has_many :upstream_dependencies, through: :task_dependencies

  has_many :task_dependents, foreign_key: :upstream_dependency_id, class_name: 'TaskDependency', dependent: :delete_all
  has_many :downstream_dependencies, through: :task_dependents, source: :project_task

  validates_presence_of :internal_name  #TaskID
  validates_uniqueness_of :internal_name, scope: [:project_id]
  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:project_id]

  ALLOWED_STATUSES = ["not_started","in_progress","completed","blocked","delayed"]
  validates_inclusion_of :status, in: ALLOWED_STATUSES

  # validate :exactly_two_constraints
  # validate :atleast_two_constraints
  validate :internal_name_not_changed

  before_validation do
    populate_default_status if self.status.blank?
  end

  # rolify
  resourcify

  def add_dependency(task)
    self.upstream_dependencies << task
  end

  def remove_dependency(task)
    self.upstream_dependencies.delete(task.id)
  end

  def add_dependent(task)
    self.downstream_dependencies << task
  end

  def remove_dependent(task)
    self.downstream_dependencies.delete(task.id)
  end

  def actual_start_date
    arr = []
    arr << start_date
    arr << dependency_max_date
    arr.compact.max
  end

  def actual_end_date
    actual_start_date + calculated_duration
  end

  def calculated_end_date
    if end_date.present?
      return end_date
    elsif start_date.present? && duration.present?
      return start_date + duration.days
    else
      return nil
    end
  end

  def calculated_duration
    if duration.present?
      return duration
    elsif start_date.present? && end_date.present?
      return (end_date - start_date).to_i
    elsif upstream_dependencies.present? && end_date.present?
      return (end_date - dependency_max_date).to_i
    end
  end

  def dependency_max_date
    tasks = upstream_dependencies
    date_array = []
    tasks.each do |task|
      puts "+++++++++++++#{task.internal_name}+++++++++++++"
      date = task.calculated_end_date || task.actual_end_date
      date_array << date
    end
    date_array.compact.map{|date| date}.flatten.max
  end

  private

  def exactly_two_constraints
    evaluated_conditions = bool_to_int(start_date.present?) + bool_to_int(end_date.present?) + 
      bool_to_int(duration.present?) + bool_to_int(upstream_dependencies.present?)
    errors.add(:duration, "Exactly 2 among TaskID, Name, Duration and Dependencies must be present.") unless evaluated_conditions == 2
  end

  def atleast_two_constraints
    evaluated_conditions = bool_to_int(start_date.present?) + bool_to_int(end_date.present?) + 
      bool_to_int(duration.present?) + bool_to_int(upstream_dependencies.present?)
    errors.add(:duration, "Atleast 2 among TaskID, Name, Duration and Dependencies must be present.") unless evaluated_conditions >= 2
  end

  def internal_name_not_changed
    if internal_name_changed? && self.persisted?
      errors.add(:internal_name, "Change of TaskID not allowed.")
    end
  end

  def bool_to_int(bool_var)
    bool_var ? 1 : 0
  end

  def populate_default_status
    self.status = "not_started"
  end
end

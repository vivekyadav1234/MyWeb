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

require 'rails_helper'

RSpec.describe ProjectTask, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

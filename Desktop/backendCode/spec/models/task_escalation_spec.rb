# == Schema Information
#
# Table name: task_escalations
#
#  id             :integer          not null, primary key
#  task_set_id    :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  task_owner     :integer
#  start_time     :datetime
#  end_time       :datetime
#  completed_at   :datetime
#  remark         :text
#  status         :string           default("no")
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  is_new         :boolean          default(TRUE)
#  seen           :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe TaskEscalation, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

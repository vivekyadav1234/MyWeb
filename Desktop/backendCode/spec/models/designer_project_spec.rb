# == Schema Information
#
# Table name: designer_projects
#
#  id                    :integer          not null, primary key
#  designer_id           :integer
#  project_id            :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  customer_status       :string           default("qualified")
#  customer_meeting_time :datetime
#  customer_remarks      :string
#  mail_token            :string
#  token_uses_left       :integer          default(0), not null
#  lead_id               :integer
#  active                :boolean          default(FALSE)
#  count_of_calls        :integer
#

require 'rails_helper'

RSpec.describe DesignerProject, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

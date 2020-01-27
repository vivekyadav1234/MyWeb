# == Schema Information
#
# Table name: custom_jobs
#
#  id                :integer          not null, primary key
#  ownerable_type    :string
#  ownerable_id      :integer
#  name              :string
#  space             :string
#  quantity          :integer
#  rate              :float
#  amount            :float
#  custom_element_id :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  estimated_cogs    :float            default(0.0)
#  clubbed_job_id    :integer
#  tag_id            :integer
#  no_bom            :boolean          default(FALSE), not null
#

require 'rails_helper'

RSpec.describe CustomJob, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

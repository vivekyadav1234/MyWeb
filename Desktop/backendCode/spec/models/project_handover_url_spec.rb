# == Schema Information
#
# Table name: project_handover_urls
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  url            :text
#  shared_version :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe ProjectHandoverUrl, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

# == Schema Information
#
# Table name: project_handovers
#
#  id                 :integer          not null, primary key
#  project_id         :integer
#  ownerable_type     :string
#  ownerable_id       :integer
#  file_version       :integer
#  status             :string           default("false")
#  shared_on          :datetime
#  status_changed_on  :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  remarks            :string
#  parent_handover_id :integer
#  created_by         :integer
#  category_upload    :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe ProjectHandover, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

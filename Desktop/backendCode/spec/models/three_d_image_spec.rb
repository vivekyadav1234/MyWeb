# == Schema Information
#
# Table name: three_d_images
#
#  id         :integer          not null, primary key
#  project_id :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  panel      :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe ThreeDImage, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

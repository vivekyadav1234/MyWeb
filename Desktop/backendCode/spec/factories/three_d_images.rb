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

FactoryGirl.define do
  factory :three_d_image do
    
  end
end

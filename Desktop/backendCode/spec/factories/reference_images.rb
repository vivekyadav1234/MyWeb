# == Schema Information
#
# Table name: reference_images
#
#  id         :integer          not null, primary key
#  project_id :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  panel      :boolean          default(FALSE)
#

FactoryGirl.define do
  factory :reference_image do
    
  end
end

# == Schema Information
#
# Table name: slides
#
#  id              :integer          not null, primary key
#  title           :string
#  serial          :integer          not null
#  data            :json             not null
#  presentation_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

FactoryGirl.define do
  factory :slide do
    
  end
end

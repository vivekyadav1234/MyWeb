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

FactoryGirl.define do
  factory :project_handover_url do
    
  end
end

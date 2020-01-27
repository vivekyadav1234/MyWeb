# == Schema Information
#
# Table name: presentations
#
#  id               :integer          not null, primary key
#  title            :string           not null
#  ppt_file_name    :string
#  ppt_content_type :string
#  ppt_file_size    :integer
#  ppt_updated_at   :datetime
#  project_id       :integer
#  designer_id      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

FactoryGirl.define do
  factory :presentation do
    
  end
end

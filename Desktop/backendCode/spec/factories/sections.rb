# == Schema Information
#
# Table name: sections
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  description                  :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  parent_id                    :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

FactoryGirl.define do
  factory :section do
    
  end
end

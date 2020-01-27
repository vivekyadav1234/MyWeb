# == Schema Information
#
# Table name: contents
#
#  id                    :integer          not null, primary key
#  ownerable_type        :string
#  ownerable_id          :integer
#  document_file_name    :string
#  document_content_type :string
#  document_file_size    :integer
#  document_updated_at   :datetime
#  scope                 :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

FactoryGirl.define do
  factory :content do
    
  end
end

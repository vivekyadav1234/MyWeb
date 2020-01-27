# == Schema Information
#
# Table name: documents_urls
#
#  id          :integer          not null, primary key
#  url         :text
#  type_of_url :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryGirl.define do
  factory :documents_url do
    url "MyText"
    type_of_url "MyString"
  end
end

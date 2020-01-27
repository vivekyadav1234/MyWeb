# == Schema Information
#
# Table name: boq_and_ppt_uploads
#
#  id                   :integer          not null, primary key
#  project_id           :integer
#  upload_file_name     :string
#  upload_content_type  :string
#  upload_file_size     :integer
#  upload_updated_at    :datetime
#  upload_type          :string
#  shared_with_customer :boolean
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  name                 :string
#

FactoryGirl.define do
  factory :boq_and_ppt_upload do
    project nil
    upload ""
    upload_type "MyString"
  end
end

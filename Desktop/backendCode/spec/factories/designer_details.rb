# == Schema Information
#
# Table name: designer_details
#
#  id                       :integer          not null, primary key
#  designer_id              :integer
#  instagram_handle         :string
#  designer_cv_file_name    :string
#  designer_cv_content_type :string
#  designer_cv_file_size    :integer
#  designer_cv_updated_at   :datetime
#  active                   :boolean          default(TRUE)
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#

FactoryGirl.define do
  factory :designer_detail do
    user nil
    instagram_handle "MyString"
    designer_cv ""
    active false
  end
end

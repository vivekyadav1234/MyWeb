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

class DesignerDetail < ApplicationRecord
  belongs_to :designer, :class_name => 'User'

  has_attached_file :designer_cv, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :designer_cv
end

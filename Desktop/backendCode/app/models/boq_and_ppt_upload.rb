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

class BoqAndPptUpload < ApplicationRecord
  # has_paper_trail
  belongs_to :project
  has_many :proposal_docs, as: :ownerable, dependent: :destroy
  has_many :proposals, through: :proposal_docs
  has_many :project_handovers, as: :ownerable, dependent: :destroy

  validates_presence_of :upload_type
  has_attached_file :upload, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :upload
end

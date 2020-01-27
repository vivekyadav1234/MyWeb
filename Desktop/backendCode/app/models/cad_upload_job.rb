# == Schema Information
#
# Table name: cad_upload_jobs
#
#  id              :integer          not null, primary key
#  cad_upload_id   :integer
#  uploadable_type :string
#  uploadable_id   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class CadUploadJob < ApplicationRecord
  has_paper_trail

  belongs_to :cad_upload, required: true
  belongs_to :uploadable, polymorphic: true, optional: true
end

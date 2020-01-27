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

class BoqAndPptUploadSerializer < ActiveModel::Serializer
  attributes :id, :name, :upload, :upload_type, :shared_with_customer, :created_at, :updated_at, :upload_file_name
end

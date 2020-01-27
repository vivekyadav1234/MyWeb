# == Schema Information
#
# Table name: cad_uploads
#
#  id                  :integer          not null, primary key
#  upload_name         :string
#  upload_type         :string
#  status              :string           default("pending")
#  approval_comment    :string
#  status_changed_at   :datetime
#  upload_file_name    :string
#  upload_content_type :string
#  upload_file_size    :integer
#  upload_updated_at   :datetime
#  quotation_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  approved_by_id      :integer
#  uploaded_by_id      :integer
#  seen_by_category    :boolean          default(FALSE)
#

require "#{Rails.root.join('lib','serializers','quotation_serializer_module')}"

class CadUploadSerializer < ActiveModel::Serializer
  attributes :id, :upload_name, :upload_type, :upload, :quotation_id, :created_at, :updated_at,
    :status, :status_changed_at, :approval_comment, :approved_by_id, :uploaded_by_id
end

class CadUploadDetailedSerializer < CadUploadSerializer
  attribute :boqjobs
  attribute :modular_jobs_kitchen
  attribute :modular_jobs_wardrobe
  attribute :service_jobs
  attribute :extra_jobs
  attribute :appliance_jobs
  attribute :custom_jobs
  attribute :shangpin_jobs_cabinet
  attribute :shangpin_jobs_door
  attribute :shangpin_jobs_accessory
  attribute :shangpin_jobs_wardrobe
  attribute :shangpin_jobs_sliding_door
  include QuotationSerializerModule

  private
  def object_to_evaluate
    object
  end
end

# == Schema Information
#
# Table name: project_handovers
#
#  id                 :integer          not null, primary key
#  project_id         :integer
#  ownerable_type     :string
#  ownerable_id       :integer
#  file_version       :integer
#  status             :string           default("false")
#  shared_on          :datetime
#  status_changed_on  :datetime
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  remarks            :string
#  parent_handover_id :integer
#  created_by         :integer
#  category_upload    :boolean          default(FALSE)
#

class ProjectHandover < ApplicationRecord
  require 'zip'

  has_paper_trail
  belongs_to :project
  belongs_to :ownerable, polymorphic: :true
  belongs_to :parent_handover, class_name: "ProjectHandover"
  belongs_to :status_updated_by, class_name: "User"

  has_many :child_versions,dependent: :destroy, class_name: 'ProjectHandover', foreign_key: :parent_handover_id
  has_many :production_drawings, dependent: :destroy

  before_create :increase_version

  ALLOWED_STATUS = ["pending", "pending_acceptance", "accepted", "rejected"]

  validates_inclusion_of :status, in: ALLOWED_STATUS

  scope :quotation_handovers, -> { where(ownerable_type: 'Quotation') }

  include ProjectHandovers::SegmentConcern

  def increase_version
    if self.parent_handover_id.present?
      child_versions = self.parent_handover.child_versions
      if child_versions.present?
        self.file_version = child_versions.last.file_version + 1
      else
        self.file_version = 2
      end
    else
      self.file_version = 1
    end
  end

  #*************************************************************************************
  #/////////////do not edit this method, this has beend used in many places/////////////
  #*************************************************************************************
  def self.make_categorised_hash(values, child_hash=false, category_flag=false)
    values_array = []
    values.each do |value|
      value  = value.child_versions.present? ? value.child_versions.sort.last : value if child_hash == false
      value  = value if category_flag == true
      value_hash = Hash.new
      owner = value.ownerable
      if value.ownerable_type == "Quotation"
        value_hash[:reference_number] = owner.reference_number
        value_hash[:per_50_check] = owner.per_50_true == true ? "Yes" : "No"
        value_hash[:duration] = owner.duration
        value_hash[:eta] = owner.eta
      elsif value.ownerable_type == "SiteMeasurementRequest"
        site_image = []
        owner.site_galleries&.each do |site|
          site_image << [site.site_image_file_name, site.site_image.url]
        end
        value_hash[:url] = site_image
        if owner.request_type == "standalone_site_measurement_request"
         value_hash[:request_type] = "standalone_site_measurement_output"
        elsif owner.request_type == "approved_boq_site_measurement_request"
         value_hash[:request_type] = "approved_boq_site_measurement_output"
        elsif owner.request_type == "line_marking_site_measurement_request"
          value_hash[:request_type] = "line_marking_site_measurement_output"
        elsif owner.request_type == "Initial_site_measurement_request"
          value_hash[:request_type] = "initial_site_measurement_output"
        end
      elsif value.ownerable_type == "Floorplan"
        value_hash[:url] = owner&.attachment_file&.url
        value_hash[:name] = owner&.name
      elsif value.ownerable_type == "BoqAndPptUpload"
        value_hash[:url] = owner.upload&.url
        value_hash[:name] = owner&.name
      elsif value.ownerable_type == "CadDrawing"
        value_hash[:url] = owner&.cad_drawing&.url
        value_hash[:panel] = owner&.panel
        value_hash[:name] = owner&.name
      elsif ["ThreeDImage","ReferenceImage"].include? value.ownerable_type
        value_hash[:url] = owner&.content&.document&.url
        value_hash[:panel] = owner&.panel
        value_hash[:name] = owner&.name
      elsif value.ownerable_type.in? (["Elevation", "CustomerInspiration", "LineMarking"])
        value_hash[:url] = owner&.content&.document&.url
        value_hash[:name] = owner&.name
      else
        value_hash[:name] = owner&.name
      end
      value_hash[:date_of_sharing] = value.shared_on
      value_hash[:current_status] = value.status&.humanize
      if value.ownerable_type == 'Quotation'
        value_hash[:segments_with_acceptance] = value.segments_with_acceptance
        value_hash[:status_updated_user_by_segment] = value.get_segment_approvals  # The segment wise info, where applicable
      end
      value_hash[:category_comment] = value.remarks
      value_hash[:status_changed_on] = value.status_changed_on
      value_hash[:status_updated_user] = {name: value.status_updated_by&.name, email: value.status_updated_by&.email}  # The overall info
      value_hash[:version] = value.file_version
      value_hash[:id] = value.id
      value_hash[:parent_id] = value.parent_handover_id
      value_hash[:ownerable_id] = owner&.id
      values_array.push value_hash
    end
    values_array.uniq
  end

  # to get file name and url
  def get_file_details
    hash = {}
    hash[:name] = ownerable.name
    hash[:file_url] = ownerable_type == "CadDrawing" ? ownerable.cad_drawing.url : ownerable.content.document.url
    hash
  end
end

# == Schema Information
#
# Table name: projects
#
#  id                :integer          not null, primary key
#  name              :string
#  user_id           :integer
#  details           :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  lead_id           :integer
#  status            :string
#  remarks           :string
#  wip_time          :datetime
#  count_of_calls    :integer
#  status_updated_at :datetime
#  reason_for_lost   :string
#  sub_status        :string
#  new_handover_file :boolean          default(FALSE)
#  last_handover_at  :datetime
#

require "#{Rails.root.join('lib','serializers','project_serializer_common_attributes')}"

class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :status, :sub_status, :details, :assigned_to, :assigned, :created_at, :updated_at, :user, :designer, :community_manager, :has_pending_site_measurment_request, :floorplan_present

  include ProjectSerializerCommonAttributes

  def assigned_to
    object.designers.pluck(:email) if object.designers.present?
  end

  def assigned
    object.designers.present?
  end

  def created_at
    object.created_at.strftime("%d-%m-%Y")
  end

  def updated_at
    object.updated_at.strftime("%d-%m-%Y")
  end

  def user
    user = object.user
    if user
      return {
        id: user&.id,
        name: user&.name,
        contact: user&.contact,
        email: user&.email
      }
    else
      return nil
    end
  end

  def designer
    object.assigned_designer.slice(:id,:name,:email) if object.assigned_designer.present?
  end

  def community_manager
    object.assigned_designer&.cm&.slice(:id,:name,:email)
  end

  def has_pending_site_measurment_request
    @request = object.site_measurement_requests.where.not(request_status: "complete")
    if @request.present?
      true
    else
      false
    end
  end

  def floorplan_present
    object.floorplans.present?
  end

end

class MobileProjectLogSerializer < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  # attributes :id, :name, :email, :contact, :is_contact_visible,
  #     :status_updated_at, :lead_status,
  #     :city, :pincode, :source, :created_at,
  #     :lost_remark, :lost_reason,
  #     :created_by
  attribute :history

  def history
    arr = []
    object.versions.each do |version|
      change_log = YAML.load version.object_changes
      keys = change_log.keys
      if keys.include?("status")
        hash = {
          created_at: "#{version.created_at}",
          changes: [change_log['status'][0].to_s, change_log['status'][1].to_s]
        }

        if keys.include?("sub_status")
          hash[:sub_status_changes] = [change_log['sub_status'][0].to_s, change_log['sub_status'][1].to_s]
        end
        arr.push(hash)
      end
    end
    arr
  end
end

class ProjectAmountDetailSerializer < ProjectSerializer
  attributes :total_payment, :total_amount_tobe_paid

  def total_payment
    object&.quotations.pluck(:paid_amount).compact.sum
  end

  def total_amount_tobe_paid
    object.quotations.where(is_approved: true).pluck(:total_amount).compact.sum
  end
end


class ProjectForCadSerializer < ActiveModel::Serializer
  attributes :id, :reference_number, :client_name, :no_of_cad_files, :assigned_designer, :assigned_cm, :latest_cad_file_upload_date,
    :cad_uploads, :lead_id, :tat, :new

  def client_name
    object.project.user.name.titleize
  end

  def no_of_cad_files
    object.cad_uploads.count
  end

  def assigned_designer
    object.project&.assigned_designer.name.titleize
  end

  def assigned_cm
    object.project&.assigned_designer.cm.name.titleize
  end

  def latest_cad_file_upload_date
    object.cad_uploads&.sort&.last&.created_at&.strftime("%e %b %Y %H:%M:%S%p")
  end

  def cad_uploads
    cad_array = []
    object.cad_uploads.each do |cad|
      hash = Hash.new
      hash[:id] = cad.id
      hash[:upload_name] = cad.upload_name
      hash[:upload_type] = cad.upload_type
      hash[:status] = cad.status
      hash[:approval_comment] = cad.approval_comment
      hash[:upload_file_name] = cad.upload_file_name
      hash[:upload_content_type] = cad.upload_content_type
      hash[:upload_file_size] = cad.upload_file_size
      hash[:upload_updated_at] = cad.upload_updated_at
      hash[:upload_updated_at] = cad.upload_updated_at
      hash[:quotation_id] = cad.quotation_id
      hash[:created_at] = cad.created_at
      hash[:updated_at] = cad.updated_at
      hash[:approved_by] = "#{cad.approved_by&.name}"
      hash[:uploaded_by] = "#{cad.uploaded_by&.name}"
      hash[:seen_by_category] = cad.seen_by_category
      hash[:project_id] = cad.quotation.project_id
      hash[:url] = cad.upload.url
      hash[:status_changed_at] = cad.status_changed_at
      hash[:tat] = cad.status == "pending" ?  (((cad.created_at + 48.hours) - Time.zone.now)/3600).round : "-"
      cad_array.push hash
    end
    cad_array
  end

  def lead_id
    object.project.lead.id
  end

  def tat
    object.cad_uploads.pluck(:status).include?("pending") ? (((object.cad_uploads.sort.last.created_at + 48.hours) - Time.zone.now)/3600).round : "-"
  end

  def new
    object.cad_uploads.where(seen_by_category: false).present? ? true : false
  end

end

class ProjectCadSerializer < ActiveModel::Serializer
  attributes :id, :name
  include ProjectSerializerCommonAttributes

  attribute :user
  attribute :designer
  attribute :community_manager
end



class ProjectCadSerializer < ActiveModel::Serializer
  attributes :id, :name
  include ProjectSerializerCommonAttributes

  attribute :user
  attribute :designer
  attribute :community_manager
end

class BusinessProjectSerializer < ProjectSerializer
  attributes :cost_price, :sales_price

  def cost_price
    object.quotations.map(&:estimated_cogs).compact.sum.round(2)
  end

  def sales_price
    object.quotations.pluck(:total_amount).compact.sum.round(2)
  end

end

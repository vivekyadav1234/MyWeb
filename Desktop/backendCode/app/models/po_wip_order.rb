# == Schema Information
#
# Table name: po_wip_orders
#
#  id                      :integer          not null, primary key
#  po_name                 :string
#  status                  :string           default("pending")
#  billing_address         :text
#  billing_contact_person  :string
#  billing_contact_number  :string
#  shipping_address        :text
#  shipping_contact_number :string
#  shipping_contact_person :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  lead_id                 :integer
#  vendor_gst              :string
#  po_type                 :string
#  tag_snag                :boolean          default(FALSE), not null
#

class PoWipOrder < ApplicationRecord
  belongs_to :lead, optional: true

  has_many :po_wip_orders_wip_slis, dependent: :destroy
  has_many :wip_slis, through: :po_wip_orders_wip_slis
  STATUS = ["pending", "po_created", "modify_po", "cancelled", "po_recieved"]

  validate :tag_snag_only_project_office

  before_create :set_name

  def set_name
    previous = PoWipOrder.last&.po_name
    previous_dm = previous[2...8] if previous.present?
    dm = Date.today.strftime("%Y%m")
    if previous_dm == dm
      new_num = (previous[8..-1].to_i+1).to_s.rjust(4, '0')
    else
      new_num = "1".rjust(4, '0')
    end
    self.po_name = "PO"+Date.today.strftime("%Y%m")+new_num
  end


  def update_status_and_quantities
    po_wip_orders_wip_slis.where(parent_wip_sli: nil).each do |po_wip_orders_wip_sli|
      sli = po_wip_orders_wip_sli.wip_sli
      po_wip_orders_wip_sli.quantity = sli.quantity
      po_wip_orders_wip_sli.save!
    end
  end

  def po_pdf_generation(user)
    bulk_po = BulkPoPdf.new(self, user)
    file_name = self.po_name+".pdf"
    filepath = Rails.root.join("public",file_name)
    bulk_po.render_file(filepath)
    {bas_64_encoded: Base64.encode64(File.open(filepath).to_a.join), filepath: filepath, file_name: file_name, display_path: "/#{file_name}"}
  end

  private
  def tag_snag_only_project_office
    if tag_snag && !po_type.in?(["project", "office"])
      errors.add(:tag_snag, "Tagging snag is only allowed for Normal POs, Office POs and Project POs.")
    end
  end
end

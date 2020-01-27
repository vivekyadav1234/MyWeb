# == Schema Information
#
# Table name: purchase_orders
#
#  id                     :integer          not null, primary key
#  project_id             :integer
#  quotation_id           :integer
#  status                 :string           default("pending")
#  contact_person         :string
#  contact_number         :string
#  shipping_address       :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  vendor_id              :integer
#  billing_address        :string
#  billing_contact_person :string
#  billing_contact_number :string
#  vendor_gst             :string
#  modifying              :boolean          default(FALSE)
#  movement               :string
#  release_count          :integer          default(0)
#  tag_snag               :boolean          default(FALSE), not null
#

class PurchaseOrderSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :project_id, :quotation_id, :status, :contact_person, :contact_number, 
  :shipping_address, :reference_no, :created_at, :updated_at, :vendor_id, :modifying, :tag_snag

  attribute :quotation_reference_number do |object|
    object.quotation&.reference_number  
  end

  attribute :job_elements do |object|
    object.po_line_item_details
  end

  attribute :vendor_name do |object|
    object.vendor&.name
  end
end

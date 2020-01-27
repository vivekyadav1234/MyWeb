# == Schema Information
#
# Table name: vendor_products
#
#  id                  :integer          not null, primary key
#  sli_code            :string
#  sli_name            :string
#  vendor_code         :string
#  unit                :string
#  rate                :float
#  vendor_id           :integer
#  master_line_item_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  sli_group_code      :string
#

# This table stores the master data from which we can populate SLIs
class VendorProduct < ApplicationRecord
  has_paper_trail

  belongs_to :vendor, required: true
  belongs_to :master_line_item, required: true
  has_many :wip_slis, dependent: :destroy
  has_one :po_inventory
  

  has_many :sli_dynamic_attributes, dependent: :destroy
  has_many :job_elements  #no dependent destroy as deletion not allowed if SLIs exist

  validates_presence_of [:sli_group_code, :sli_code, :sli_name, :unit, :rate]
  validates_uniqueness_of :sli_code
  validates :rate, numericality: { greater_than_or_equal_to: 0 }

  # units that are allowed for vendor products
  UNITS = {
    "S Ft" => "s_ft",
    "R Ft" => "r_ft",
    "R Mt" => "r_mt",
    "Nos" => "nos",
    "Set" => "set",
    "Sq M" => "sq_m"
  }

  validates_inclusion_of :unit, in: UNITS.values

  def self.lowest_priced
    self.order(rate: :asc).limit(1).take
  end

  # based on the material_code to vendor_product mapping, choose lowest priced
  # For now, return a random one as we don't have the mapping.
  def self.get_vendor_product(material_code)
    VendorProduct.offset(rand(VendorProduct.count)).limit(1).take
  end

  # Get a vendor product by the order number (which is nothing but the vendor code).
  # Please note that vendor code uniqueness is not enforced by our application, which means that
  # it is upto Abhishek and other Arrivae team to ensure that at least for Hardware and Addons, 
  # no vendor code is duplicated.
  # In case of any duplication, take latest created one.
  def master_sli_by_order(vendor_code)
    VendorProduct.where(vendor_code: vendor_code).last
  end

  # get the readable value of a unit eg "S Ft" for "s_ft" (from UNITS hash)
  def unit_readable
    UNITS.key(unit)
  end

  # for non-reference attributes only!
  def sli_dynamic_attr_value(attr_name)
    sli_dynamic_attributes.joins(:mli_attribute).where(mli_attributes: { attr_name: attr_name }).take&.attr_value
  end

  # given a handle code and handle master line item name, return the lowest priced vendor product.
  # first check for kitchen, then for wardrobes.
  def self.get_handle_vendor_product_lm(mli_name, handle_code)
    mli_name = handle_mli_name
    master_line_item = MasterLineItem.lakhs_modular.find_by_mli_name(mli_name)
    handle = Handle.kitchen.find_by_code(handle_code)
    handle = Handle.wardrobe.find_by_code(handle_code) if handle.blank?
    return nil if handle.blank?
    vendor_products_eligible = master_line_item.vendor_products.joins(sli_dynamic_attributes: :mli_attribute).
      where(mli_attributes: {attr_name: 'arrivae_handle'}, sli_dynamic_attributes: {attr_value: handle.id})
    vendor_product_chosen = vendor_products_eligible.lowest_priced
    return vendor_product_chosen
  end

  # IMOS excel will have "_" instead of "-". This resolves that.
  # Also, ";" to ","
  # Also, ")" to " " (space)
  def underscore_to_hyphen(str)
    str.gsub("_", "-").gsub(";", ",").gsub(")", " ")
  end
end

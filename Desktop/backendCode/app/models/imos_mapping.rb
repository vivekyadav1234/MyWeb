# == Schema Information
#
# Table name: imos_mappings
#
#  id             :integer          not null, primary key
#  imos_code      :string
#  mapping_type   :string
#  sli_group_code :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class ImosMapping < ApplicationRecord
  validates_presence_of :imos_code
  validates_presence_of :sli_group_code

  ALL_TYPES = ["core", "finish", "edge_banding"]
  validates_inclusion_of :mapping_type, in: ALL_TYPES

  # only ONE unique combination of [:imos_code, :sli_group_code]
  validates_uniqueness_of :sli_group_code, scope: [:imos_code]

  scope :core_materials, -> { where(mapping_type: 'core') }
  scope :finishes, -> { where(mapping_type: 'finish') }
  scope :edge_bandings, -> { where(mapping_type: 'edge_banding') }

  def ImosMapping.get_master_sli(imos_code)
    imos_mapping = ImosMapping.find_by(imos_code: imos_code)
    return nil if imos_mapping.blank?
    vendor_product = VendorProduct.where(sli_group_code: imos_mapping.sli_group_code).lowest_priced
    vendor_product
  end
end

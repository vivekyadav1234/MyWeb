# == Schema Information
#
# Table name: bom_sli_cutting_list_mappings
#
#  id             :integer          not null, primary key
#  program_code   :string           not null
#  sli_group_code :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

# This mapping maps the codes in BOM SLI manual sheet's cutting list sheet to SLI group codes in Delta.
class BomSliCuttingListMapping < ApplicationRecord
  validates_presence_of :program_code, :sli_group_code
  validates_uniqueness_of :program_code

  def BomSliCuttingListMapping.get_master_sli(program_code)
    bom_sli_cutting_list_mapping = BomSliCuttingListMapping.find_by(program_code: program_code)
    return nil if bom_sli_cutting_list_mapping.blank?
    vendor_product = VendorProduct.where(sli_group_code: bom_sli_cutting_list_mapping.sli_group_code).lowest_priced
    vendor_product
  end
end

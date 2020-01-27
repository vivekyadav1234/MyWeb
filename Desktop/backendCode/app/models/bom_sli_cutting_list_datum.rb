# == Schema Information
#
# Table name: bom_sli_cutting_list_data
#
#  id                 :integer          not null, primary key
#  sheet              :string           not null
#  row                :integer          not null
#  sr_no              :string
#  article_code       :string
#  article_name       :string
#  part_name          :string
#  mat_top_lam_bottom :string
#  finish_length      :float
#  finish_width       :float
#  finish_height      :float
#  finish_thk         :float
#  qty                :float
#  part_code          :string
#  barcode1           :string
#  barcode2           :string
#  edge1              :string
#  edge2              :string
#  edge3              :string
#  edge4              :string
#  grain              :string
#  cutting_length     :string
#  cutting_width      :string
#  cutting_thk        :string
#  customer_name      :string
#  part_material      :string
#  laminate_top       :string
#  laminate_bottom    :string
#  size               :string
#  edgeband_qty       :float
#  boq_label_id       :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  import_type        :string
#

class BomSliCuttingListDatum < ApplicationRecord
  has_paper_trail
  
  belongs_to :boq_label, required: true

  has_many :job_elements

  ALLOWED_IMPORT_TYPES = ['bom_sli_manual_sheet', 'imos_manual_sheet']
  validates_inclusion_of :import_type, in: ALLOWED_IMPORT_TYPES

  def quotation
    boq_label.quotation
  end

  def part_material_quantity
    qty.to_f * (cutting_length.to_f * cutting_width.to_f)/92903
  end

  # in sq ft
  def total_edgeband_qty
    edgeband_qty.to_f
  end
end

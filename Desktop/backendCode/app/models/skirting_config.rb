# == Schema Information
#
# Table name: skirting_configs
#
#  id              :integer          not null, primary key
#  skirting_type   :string
#  skirting_height :integer
#  price           :float
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  lead_time       :integer          default(0)
#

class SkirtingConfig < ApplicationRecord
  has_paper_trail

  validates_presence_of :skirting_type
  validates_presence_of :skirting_height

  validates_uniqueness_of :skirting_height, scope: [:skirting_type]

  def SkirtingConfig.get_price(skirting_type, skirting_height)
    SkirtingConfig.find_by(skirting_type: skirting_type, skirting_height: skirting_height).price
  end
end

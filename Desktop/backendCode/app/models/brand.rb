# == Schema Information
#
# Table name: brands
#
#  id         :integer          not null, primary key
#  name       :string
#  hardware   :boolean          default(TRUE)
#  addon      :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Brand < ApplicationRecord
  has_paper_trail

  has_many :addons
  has_many :hardware_elements
  has_many :modular_jobs
  has_many :combined_doors

  validates_presence_of :name
  validates_uniqueness_of :name

  scope :hardware_brands, -> {where(hardware: true)}
  scope :addon_brands, -> {where(addon: true)}

  def Brand.default_brand
    Brand.find_by_name MKW_GLOBAL_DATA["default_hardware_brand"]
    rescue
      Brand.none
  end
end

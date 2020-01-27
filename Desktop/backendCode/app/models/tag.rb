# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tag_type   :string
#

class Tag < ApplicationRecord
  has_many :addon_tag_mappings, dependent: :destroy
  has_many :addons, through: :addon_tag_mappings, inverse_of: :tag

  #CM Tag Mapping
  has_many :cm_tag_mappings, dependent: :destroy
  has_many :users, through: :cm_tag_mappings

  has_many :leads

  has_many :section_tags  #don't automatically delete if tags are in use
  has_many :sections, through: :section_tags

  has_many :product_space_tags  #don't automatically delete if tags are in use
  has_many :products_in_space, through: :product_space_tags, source: :product

  has_many :product_range_tags  #don't automatically delete if tags are in use
  has_many :products_in_range, through: :product_range_tags, source: :product

  has_many :boqjobs
  has_many :modular_jobs
  has_many :service_jobs
  has_many :custom_jobs
  has_many :appliance_jobs
  has_many :extra_jobs
  has_many :shangpin_jobs
  
  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:tag_type]

  # never modify any value inside the array - you can add new values
  ALL_TAG_TYPES = ["addons", "loose_spaces", "non_panel_ranges", "lead", "old_leads" , "line_item_split"]
  SPLIT_TAGS = ["modular_kitchen", "civil_kitchen", "modular_wardrobe", "non_panel_furniture", "panel_furniture", "services"]
  CUTTINGLIST_TAG = ["modular_kitchen", "civil_kitchen", "modular_wardrobe", "panel_furniture"]
  validates_inclusion_of :tag_type, in: ( ALL_TAG_TYPES + SPLIT_TAGS + CUTTINGLIST_TAG ).uniq

  scope :addons, ->{ where(tag_type: "addons") }
  scope :loose_spaces, ->{ where(tag_type: "loose_spaces") }
  scope :non_panel_ranges, ->{ where(tag_type: "non_panel_ranges") }
  scope :leads, ->{ where(tag_type: "lead") }

  def name=(value)
    if value.present?
      self[:name] = Tag.format_name value
    else
      self[:name] = value
    end
  end

  def self.mkw
    leads.find_by(name: 'mkw')
  end

  def self.full_home
    leads.find_by(name: 'full_home')
  end

  def self.tags_for_cutting_list_and_bom
    Tag.where(name: CUTTINGLIST_TAG).pluck(:id)
  end


  # only alphabets, digits, '-' and '_' are allowed in tags
  def Tag.format_name(str)
    str.to_s.squish.downcase.gsub('/[^a-z0-9_-]/', '')
  end
end

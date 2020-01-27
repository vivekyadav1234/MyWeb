# == Schema Information
#
# Table name: addons
#
#  id                       :integer          not null, primary key
#  code                     :string
#  name                     :string
#  specifications           :string
#  price                    :float
#  brand_id                 :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  category                 :string
#  addon_image_file_name    :string
#  addon_image_content_type :string
#  addon_image_file_size    :integer
#  addon_image_updated_at   :datetime
#  vendor_sku               :string
#  extra                    :boolean          default(FALSE)
#  mrp                      :float
#  allowed_in_custom_unit   :boolean          default(FALSE)
#  lead_time                :integer          default(0)
#  hidden                   :boolean          default(FALSE), not null
#  arrivae_select           :boolean          default(FALSE), not null
#

class Addon < ApplicationRecord
  has_paper_trail

  belongs_to :brand

  has_many :addon_combination_mappings, dependent: :destroy
  has_many :addon_combinations, through: :addon_combination_mappings

  has_many :job_addons, dependent: :destroy
  has_many :modular_jobs, through: :job_addons

  # mapping for which addons are allowed for which modules
  has_many :product_module_addons, dependent: :destroy
  has_many :allowed_product_modules, through: :product_module_addons, source: :product_module

  has_many :addon_tag_mappings, dependent: :destroy
  has_many :tags, through: :addon_tag_mappings

  has_many :addons_for_addons_mappings, dependent: :destroy
  has_many :kitchen_module_addon_mappings, through: :addons_for_addons_mappings
  has_many :kitchen_addon_slots, through: :kitchen_module_addon_mappings

  accepts_nested_attributes_for :tags, allow_destroy: true

  has_many :extra_jobs

  has_attached_file :addon_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :addon_image, content_type: /\Aimage\/.*\z/

  validates_presence_of :code
  validates_uniqueness_of :code, scope: [:category, :brand_id]

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}
  scope :extra, -> {where(extra: true)}
  # hidden addons will exist in DB, but will not be available to be added in BOQs.
  scope :not_hidden, -> {where(hidden: false)}
  scope :arrivae_select, -> {where(arrivae_select: true)}
  scope :modspace, -> {where(modspace: true)}
  scope :not_modspace, -> {where.not(modspace: true)}

  alias addon_tags tags

  # search and filter
  # Sept 2019 - added :has_modspace_pricing key to filter_params. NOTE - Modspace and normal addons are mutually exclusive.
  def self.search(search_string, filter_params = {})
    if filter_params[:has_modspace_pricing]
      collection = self.not_hidden.modspace
    else
      collection = self.not_hidden.not_modspace
    end
    # search query string - partial match ok
    if search_string.to_s.present?
      collection = collection.where("code ILIKE ? OR vendor_sku ILIKE ? OR addons.name ILIKE ? OR specifications ILIKE ?", "%#{search_string}%", 
        "%#{search_string}%", "%#{search_string}%", "%#{search_string}%")
    end

    # filter - exact match but case agnostic
    # make ie brand
    if filter_params[:brand_name].present?
      collection = collection.joins(:brand).where(brands: {name: filter_params[:brand_name]})
    end

    # tags - array of tags
    if filter_params[:tags].present?
      collection = collection.joins(:tags).where(tags: {tag_type: "addons", name: filter_params[:tags]})
    end

    # arrivae_select filter
    if filter_params[:arrivae_select].present?
      collection = collection.arrivae_select
    end

    #price - input is min and max price
    if filter_params[:minimum_price].present? && filter_params[:maximum_price].present?
      minimum_price = filter_params[:minimum_price].to_f
      maximum_price = filter_params[:maximum_price].to_f
      collection = collection.where(mrp: minimum_price..maximum_price)
    end

    collection.distinct
  end

  # from global data for premium, standard, economy etc
  def tag_factor(price_factor_hash)
    factor = price_factor_hash["sale_cost_factor"][category]["addons"]["default"]
    tag_names = tags.pluck(:name)
    if tag_names.include?("premium")
      factor *= price_factor_hash["sale_cost_factor"][category]["addons"]["premium"]
    elsif tag_names.include?("standard")
      factor *= price_factor_hash["sale_cost_factor"][category]["addons"]["standard"]
    elsif tag_names.include?("economy")
      factor *= price_factor_hash["sale_cost_factor"][category]["addons"]["economy"]
    end

    factor
  end
end

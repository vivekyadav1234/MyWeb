# == Schema Information
#
# Table name: kitchen_appliances
#
#  id                           :integer          not null, primary key
#  name                         :string
#  code                         :string
#  make                         :string
#  price                        :float
#  appliance_image_file_name    :string
#  appliance_image_content_type :string
#  appliance_image_file_size    :integer
#  appliance_image_updated_at   :datetime
#  module_type_id               :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  vendor_sku                   :string
#  specifications               :string
#  warranty                     :string
#  mrp                          :float
#  lead_time                    :integer          default(0)
#  arrivae_select               :boolean          default(FALSE), not null
#

class KitchenAppliance < ApplicationRecord
  belongs_to :module_type, required: true

  has_many :appliance_jobs, dependent: :destroy

  has_attached_file :appliance_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :appliance_image, content_type: /\Aimage\/.*\z/

  validates_presence_of :name
  validates_presence_of :code
  validates_uniqueness_of :code

  validate :module_type_appliance_only

  scope :arrivae_select, -> {where(arrivae_select: true)}

  # search and filter
  def self.search(search_string, filter_params = {})
    # search query string - partial match ok
    collection = self.all
    min_price = collection.pluck(:mrp).compact.min
    max_price = collection.pluck(:mrp).compact.max

    if search_string.to_s.present?
      collection = where("kitchen_appliances.name ILIKE ? OR kitchen_appliances.code ILIKE ? OR kitchen_appliances.vendor_sku ILIKE ?", "%#{search_string}%", 
        "%#{search_string}%", "%#{search_string}%")
    end

    # filter - exact match
    # array of makes
    if filter_params[:makes].present?
      collection = collection.where(make: filter_params[:makes])
    end

    # arrivae_select filter
    if filter_params[:arrivae_select].present?
      collection = collection.arrivae_select
    end

    #mrp - input is min and max price
    # IMPORTANT - if the filter parameters are such that the min value is equal to min for the collection, and
    # the max value is equal to the max for the collection, then treat as if the filter is not applied.
    # If we don't do this, then the nil values will be missed out, which is not what a user intends when
    # choosing the full slider.
    if (filter_params[:minimum_mrp].present? && filter_params[:maximum_mrp].present?) && 
      !(filter_params[:minimum_mrp]<=min_price && filter_params[:maximum_mrp]>=max_price)
      minimum_mrp = filter_params[:minimum_mrp].to_f
      maximum_mrp = filter_params[:maximum_mrp].to_f
      collection = collection.where(mrp: minimum_mrp..maximum_mrp)
    end

    # space_tags - array of space tags
    if filter_params[:types].present?
      collection = collection.joins(:module_type).where(module_types: {id: filter_params[:ypes]}).distinct
    end

    collection
  end

  private
  def module_type_appliance_only
    errors.add(:module_type_id, "subcategory must belong to the Appliances category") unless module_type.get_kitchen_category.name == "Appliances"
  end
end

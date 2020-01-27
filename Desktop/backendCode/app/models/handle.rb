# == Schema Information
#
# Table name: handles
#
#  id                        :integer          not null, primary key
#  code                      :string
#  handle_type               :string
#  price                     :float
#  handle_image_file_name    :string
#  handle_image_content_type :string
#  handle_image_file_size    :integer
#  handle_image_updated_at   :datetime
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  category                  :string
#  mrp                       :float
#  vendor_sku                :string
#  spec                      :string
#  make                      :string
#  unit                      :string
#  lead_time                 :integer          default(0)
#  arrivae_select            :boolean          default(FALSE), not null
#  handle_class              :string           default("normal"), not null
#  hidden                    :boolean          default(FALSE), not null
#

class Handle < ApplicationRecord
  has_paper_trail

  validates_presence_of :code, :handle_type
  validates_uniqueness_of :code, scope: [:category]

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  ALLOWED_HANDLE_TYPES = ['drawer', 'shutter', 'both']
  validates_inclusion_of :handle_type, in: ALLOWED_HANDLE_TYPES

  ALLOWED_HANDLE_CLASSES = ['normal', 'profile', 'insert', 'concealed']
  validates_inclusion_of :handle_class, in: ALLOWED_HANDLE_CLASSES

  has_attached_file :handle_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :handle_image, content_type: /\Aimage\/.*\z/

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}
  scope :drawer, -> {where(handle_type: ["drawer", "both"])}
  scope :shutter, -> {where(handle_type: ["shutter", "both"])}
  scope :special, -> {where(code: ["G Section Handle", "Gola Profile", "J Section Handle", "Top Insert Handle"])}
  scope :arrivae_select, -> {where(arrivae_select: true)}
  scope :not_hidden, -> {where(hidden: false)}
  scope :modspace, -> {where(modspace: true)}
  scope :non_modspace, -> {where(modspace: false)}

  # overriding the model setter method.
  # Do this ie change setter method instead of adding before_save callback.
  def unit=(value)
    if value
      self[:unit] = value.strip.downcase
    else
      self[:unit] = value
    end
  end

  def handle_type=(value)
    self[:handle_type] = value.downcase if value
  end

  def handle_class=(value)
    self[:handle_class] = value.downcase if value
  end

  # gives these parameters, return handles
  def Handle.handles_by_module_finish(category, handle_type, shutter_finish, product_module=nil)
    aluminium_profile_shutter_flag = ProductModule.aluminium_profile_shutter.include?(product_module)

    return Handle.none unless ALLOWED_HANDLE_TYPES.include?(handle_type)

    if aluminium_profile_shutter_flag
      Handle.send(handle_type).where(category: category).special.where.not(code: "Top Insert Handle")
      # hash.merge(selected: Handle.g_section_handle.id if aluminium_profile_shutter_flag
    elsif ShutterFinish.back_painted_glass.include?(shutter_finish)
      Handle.send(handle_type).where(category: category).special
    else
      Handle.send(handle_type).where(category: category)
    end
  end

  # search and filter
  def Handle.search(search_string, filter_params = {})
    # search query string - partial match ok
    collection = self.all
    min_mrp = collection.pluck(:mrp).compact.min
    max_mrp = collection.pluck(:mrp).compact.max

    if search_string.to_s.present?
      collection = where("handles.spec ILIKE ? OR handles.code ILIKE ? OR handles.vendor_sku ILIKE ?", "%#{search_string}%", 
        "%#{search_string}%", "%#{search_string}%")
    end

    # filter - exact match
    # array of makes (OEMs)
    if filter_params[:makes].present?
      collection = collection.where(make: filter_params[:makes])
    end

    # arrivae_select filter
    if filter_params[:arrivae_select].present?
      collection = collection.arrivae_select
    end

    # normal, profile etc
    if filter_params[:handle_class].present?
      collection = collection.where(handle_class: filter_params[:handle_class])
    end

    #mrp - input is min and max price
    # IMPORTANT - if the filter parameters are such that the min value is equal to min for the collection, and
    # the max value is equal to the max for the collection, then treat as if the filter is not applied.
    # If we don't do this, then the nil values will be missed out, which is not what a user intends when
    # choosing the full slider.
    if (filter_params[:minimum_mrp].present? && filter_params[:maximum_mrp].present?) && 
      !(filter_params[:minimum_mrp]<=min_mrp && filter_params[:maximum_mrp]>=max_mrp)
      minimum_mrp = filter_params[:minimum_mrp].to_f
      maximum_mrp = filter_params[:maximum_mrp].to_f
      collection = collection.where(mrp: minimum_mrp..maximum_mrp)
    end

    collection
  end

  def Handle.g_section_handle
    find_by(code: "G Section Handle")
  end

  # should this handle's price be calculated by the same formula as for g-section handle?
  # not to be applied for special handles, of course
  def Handle.calculate_as_g_section?(code, category)
    handle = Handle.find_by(code: code, category: category)
    handle.present? && handle.unit == "r ft" && !["J Section Handle", "Top Insert Handle", "Gola Profile"].include?(code)
  end
end

# == Schema Information
#
# Table name: products
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  sale_price                   :float
#  section_id                   :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  image_name                   :string
#  model_no                     :string
#  color                        :string
#  finish                       :string
#  product_config               :string
#  length                       :integer
#  width                        :integer
#  height                       :integer
#  vendor_sku                   :string
#  vendor_name                  :string
#  vendor_location              :string
#  cost_price                   :float
#  model3d_file                 :string
#  manufacturing_time_days      :integer
#  product_url                  :string
#  material                     :text
#  dimension_remark             :text
#  warranty                     :string
#  remark                       :text
#  measurement_unit             :string
#  qty                          :integer
#  unique_sku                   :string
#  product_configuration_id     :integer
#  parent_product_id            :integer
#  product_image_file_name      :string
#  product_image_content_type   :string
#  product_image_file_size      :integer
#  product_image_updated_at     :datetime
#  lead_time                    :integer
#  hidden                       :boolean          default(FALSE)
#  units_sold                   :integer          default(0)
#  origin                       :string           default("arrivae"), not null
#  imported_sku                 :string
#  last_imported_at             :datetime
#  catalog_type                 :string           default("arrivae"), not null
#

class Product < ApplicationRecord
  require 'open-uri'

  paginates_per 12
  
  has_paper_trail
  #associations
  belongs_to :section, optional: true   #This is supposed to be no longer used. Will be deleted in future if safe.
  # belongs_to :catalog_segment
  # belongs_to :catalog_category
  # belongs_to :catalog_subcategory
  # belongs_to :catalog_class
  belongs_to :product_configuration
  belongs_to :parent_product, class_name: 'Product'

  has_many :variations, class_name: 'Product', foreign_key: :parent_product_id
  has_many :price_specifications
  has_many :boqjobs

  has_many :unit_product_mappings, dependent: :destroy
  has_many :business_units, through: :unit_product_mappings

  has_many :product_segments, dependent: :destroy
  has_many :catalog_segments, through: :product_segments

  has_many :product_categories, dependent: :destroy
  has_many :catalog_categories, through: :product_categories

  has_many :product_subcategories, dependent: :destroy
  has_many :catalog_subcategories, through: :product_subcategories

  has_many :product_classes, dependent: :destroy
  has_many :catalog_classes, through: :product_classes

  has_many :product_space_tags, dependent: :destroy
  has_many :space_tags, through: :product_space_tags, source: :tag

  has_many :product_range_tags, dependent: :destroy
  has_many :range_tags, through: :product_range_tags, source: :tag

  has_many :product_likes, dependent: :destroy
  has_many :users, through: :product_likes

  has_many :presentations_products, dependent: :destroy
  has_many :presentations, through: :presentations_products
  has_many :product_images, dependent: :destroy

  has_one :urban_ladder_info, dependent: :destroy

  has_attached_file :product_image, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :product_image, content_type: /\Aimage\/.*\z/

  validates_presence_of :unique_sku
  validates_uniqueness_of :unique_sku

  validates_uniqueness_of :imported_sku, allow_nil: true

  #validations
  validates_presence_of :name

  # validates_uniqueness_of :image_name, scope: [:section_id], allow_blank: true
  has_many :contents, as: :ownerable
  accepts_nested_attributes_for :contents, allow_destroy: true

  has_many :product_master_options
  has_many :master_options, through: :product_master_options

  has_attached_file :attachment_file, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :attachment_file, content_type: /\Aimage\/.*\z/

  ALL_PRODUCT_ORIGIN = ["arrivae", "urban_ladder"]
  validates_inclusion_of :origin, in: ALL_PRODUCT_ORIGIN
  CATALOG_TYPES = ['arrivae', 'polka']
  DEFAULT_CATALOG_TYPE = 'arrivae'
  validates_inclusion_of :catalog_type, in: CATALOG_TYPES

  # hidden products will exist in DB, but will not be available to be added in BOQs.
  scope :not_hidden, -> {where(hidden: false)}
  scope :urban_ladder, -> {where(origin: "urban_ladder")}
  scope :of_catalog_type, -> (catalog_type) { where(catalog_type: catalog_type) if catalog_type.present? }

  def lead_time
    45 ## fixed as per new requirement
  end
  
  # setter methods modified to store 'and' instead of '&' - this prevents issues with filter
  def product_config=(value)
    self[:product_config] = value&.gsub('&', 'and')
  end

  def material=(value)
    self[:material] = value&.gsub('&', 'and')
  end

  def color=(value)
    self[:color] = value&.gsub('&', 'and')
  end

  def finish=(value)
    self[:finish] = value&.gsub('&', 'and')
  end

  # Map a business_unit against this.
  def add_business_unit(business_unit)
    self.business_units << business_unit
  end

  # Remove a mapped business_unit.
  def remove_business_unit(business_unit)
    self.business_units.delete(business_unit.id)
  end

  # Map a segment against this.
  def add_segment(catalog_segment)
    self.catalog_segments << catalog_segment
  end

  # Remove a mapped segment.
  def remove_segment(catalog_segment)
    self.catalog_segments.delete(catalog_segment.id)
  end

  # Map a category against this.
  def add_category(catalog_category)
    self.catalog_categories << catalog_category
  end

  # Remove a mapped category.
  def remove_category(catalog_category)
    self.catalog_categories.delete(catalog_category.id)
  end

  # Map a subcategory against this.
  def add_subcategory(catalog_subcategory)
    self.catalog_subcategories << catalog_subcategory
  end

  # Remove a mapped subcategory.
  def remove_subcategory(catalog_subcategory)
    self.catalog_subcategories.delete(catalog_subcategory.id)
  end

  # Map a class against this.
  def add_catalog_class(catalog_class)
    self.catalog_classs << catalog_class
  end

  # Remove a mapped class.
  def remove_catalog_class(catalog_class)
    self.catalog_classses.delete(catalog_class.id)
  end

  def Product.with_nearest_price(price)
    not_hidden.order("abs(sale_price - #{price})").limit(1).take
  end

  # If a product is not liked by a user, mark it as liked. If it was liked, then remove the like.
  def toggle_like(user)
    mapping = product_likes.where(user: user).first_or_initialize
    if mapping.new_record?
      mapping.save
      return true
    else
      mapping.destroy
      return false
    end
  end

  # search and filter
  def Product.search(search_string, filter_params = {})
    # search query string - partial match ok
    collection = self.all
    min_price = collection.pluck(:sale_price).compact.min || Product.minimum(:sale_price).to_f
    max_price = collection.pluck(:sale_price).compact.max || Product.maximum(:sale_price).to_f
    min_lead_time = collection.pluck(:lead_time).compact.min || Product.minimum(:lead_time).to_i
    max_lead_time = collection.pluck(:lead_time).compact.max || Product.maximum(:lead_time).to_i
    min_width = collection.pluck(:width).compact.min || Product.minimum(:width).to_i
    max_width = collection.pluck(:width).compact.max || Product.maximum(:width).to_i
    min_length = collection.pluck(:length).compact.min || Product.minimum(:length).to_i
    max_length = collection.pluck(:length).compact.max || Product.maximum(:length).to_i
    min_height = collection.pluck(:height).compact.min || Product.minimum(:height).to_i
    max_height = collection.pluck(:height).compact.max || Product.maximum(:height).to_i

    if search_string.to_s.present?
      collection = where("products.name ILIKE ? OR products.unique_sku ILIKE ? OR products.vendor_sku ILIKE ?", "%#{search_string}%", 
        "%#{search_string}%", "%#{search_string}%")
    end

    # Filter by new products ie those created within the last 30 days
    if filter_params[:new].present?
      collection = collection.where("products.created_at > ?", 30.days.ago)
    end

    # Filter by saved (ie liked) products.
    if filter_params[:liked].present?
      this_user_likes = filter_params[:current_user].product_likes
      collection = collection.joins(:product_likes).where(product_likes: { id: this_user_likes })
    end

    # No longer needed - delete later.
    # filter - exact match
    # array of materials
    # if filter_params[:materials].present?
    #   collection = collection.where(material: filter_params[:materials])
    # end

    # No longer needed - delete later.
    # filter - exact match
    # array of colors
    # if filter_params[:colors].present?
    #   collection = collection.where(color: filter_params[:colors])
    # end

    # No longer needed - delete later.
    # filter - exact match
    # array of finishes
    # if filter_params[:finishes].present?
    #   collection = collection.where(finish: filter_params[:finishes])
    # end

    # No longer needed - delete later.
    # filter - exact match
    # array of configurations
    # if filter_params[:configurations].present?
    #   collection = collection.where(product_config: filter_params[:configurations])
    # end

    # sale_price - input is min and max price
    # IMPORTANT - if the filter parameters are such that the min value is equal to min for the collection, and
    # the max value is equal to the max for the collection, then treat as if the filter is not applied.
    # If we don't do this, then the nil values will be missed out, which is not what a user intends when
    # choosing the full slider.
    if (filter_params[:minimum_price].present? && filter_params[:maximum_price].present?) && 
      !(filter_params[:minimum_price].to_f <= min_price && filter_params[:maximum_price].to_f >= max_price)
      minimum_price = filter_params[:minimum_price].to_f
      maximum_price = filter_params[:maximum_price].to_f
      collection = collection.where(sale_price: minimum_price..maximum_price)
    end

    #lead_time - input is min and max lead_time
    if (filter_params[:minimum_lead_time].present? && filter_params[:maximum_lead_time].present?) && 
      !(filter_params[:minimum_lead_time].to_f <= min_lead_time && filter_params[:maximum_lead_time].to_f >= max_lead_time)
      minimum_lead_time = filter_params[:minimum_lead_time].to_f
      maximum_lead_time = filter_params[:maximum_lead_time].to_f
      collection = collection.where(lead_time: minimum_lead_time..maximum_lead_time)
    end

    #width - input is min and max width
    if (filter_params[:minimum_width].present? && filter_params[:maximum_width].present?) && 
      !(filter_params[:minimum_width].to_f <= min_width && filter_params[:maximum_width].to_f >= max_width)
      minimum_width = filter_params[:minimum_width].to_f
      maximum_width = filter_params[:maximum_width].to_f
      collection = collection.where(width: minimum_width..maximum_width)
    end

    #length ie depth - input is min and max length
    if (filter_params[:minimum_length].present? && filter_params[:maximum_length].present?) && 
      !(filter_params[:minimum_length].to_f <= min_length && filter_params[:maximum_length].to_f >= max_length)
      minimum_length = filter_params[:minimum_length].to_f
      maximum_length = filter_params[:maximum_length].to_f
      collection = collection.where(length: minimum_length..maximum_length)
    end

    #height - input is min and max height
    if (filter_params[:minimum_height].present? && filter_params[:maximum_height].present?) && 
      !(filter_params[:minimum_height].to_f <= min_height && filter_params[:maximum_height].to_f >= max_height)
      minimum_height = filter_params[:minimum_height].to_f
      maximum_height = filter_params[:maximum_height].to_f
      collection = collection.where(height: minimum_height..maximum_height)
    end

    # No longer needed - delete later.
    # space_tags - array of space tags
    # if filter_params[:space_tags].present?
    #   collection = collection.joins(:space_tags).where(tags: {tag_type: "loose_spaces", id: filter_params[:space_tags]})
    # end

    # No longer needed - delete later.
    # range_tags - array of space tags
    # if filter_params[:range_tags].present?
    #   # collection = collection.joins(:range_tags).where(tags: {tag_type: "non_panel_ranges", id: filter_params[:range_tags]})
    #   collection = Product.where(id: collection).joins(:range_tags).where(tags: {tag_type: "non_panel_ranges", id: filter_params[:range_tags]}).distinct
    # end

    # No longer needed - delete later.
    # categories - array of category ids.
    # if filter_params[:category_ids].present?
    #   # collection = collection.joins(:section).where(sections: {id: filter_params[:category_ids]}).distinct
    #   collection = Product.where(id: collection).joins(:section).where(sections: {id: filter_params[:category_ids]}).distinct
    # end

    # classes - array of class ids.
    if filter_params[:class_ids].present?
      # collection = collection.joins(:section).where(sections: {id: filter_params[:category_ids]}).distinct
      collection = Product.where(id: collection).joins(:catalog_classes).where(catalog_classes: {id: filter_params[:class_ids]}).distinct
    end

    if filter_params[:sort_key].present?
      collection.not_hidden.sort_by_key(filter_params[:sort_key])
    else
      collection.not_hidden
    end
  end

  def Product.sort_by_key(sort_key)
    collection_ids = self.all.pluck(:id)
    collection = Product.where(id: collection_ids)
    if sort_key == 'price_high_to_low'
      collection.order(sale_price: :desc)
    elsif sort_key == 'price_low_to_high'
      collection.order(sale_price: :asc)
    elsif sort_key == 'newest_first'
      collection.order(created_at: :desc)
    else
      collection
    end
  end

  def dimensions
    [length, width, height].join("X")
  end


  def self.download_catalogs(emails)
    Catalog::CatalogDownloadJob.perform_later(emails)
  end

  def self.download_excel_catalogs(emails)
    Section.loose_furniture.children.each do |section|
      prod_ids = section.products.ids
      group_product_ids = prod_ids.each_slice(30).to_a
      group_product_ids.each_with_index do |pro_ids,index|
        # byebug
        Catalog::CatalogExcelDownloadJob.perform_later(pro_ids,index,section.id,emails) if section.products.present?
      end
    end
  end

  def self.download_catalog_excel(section_name,product_ids,index)
    product_headers = ["Sr.No.", "Image", "Unique SKU Code", "Length (mm)", "Breadth (mm)", "Height (mm)", "Material", "Warranty", "Finish", "Vendor SKU Code", "Product", "Color", "Configuration", "Selling Price", "Lead Time", "Remarks", "Measurement Units", "No of units", "Space", "Range"]
    products = Product.where(id: product_ids)
    p = Axlsx::Package.new
    product_xlsx = p.workbook
    product_xlsx.add_worksheet(:name => "Basic Worksheet") do |sheet|
      sheet.add_row product_headers
      sr_no = 1
      products.find_each do |product|
        @logo = product.product_image
        if product.product_image.present?
          @logo_image = Tempfile.new(['', ".#{@logo.url.split('.').last.split('?').first}"])

          begin
            @logo_image.binmode # note that our tempfile must be in binary mode
            @logo_image.write open("https:#{@logo.url}").read
            @logo_image.rewind
            @product_img = @logo_image.path
          rescue OpenURI::HTTPError => error
            @product_img = File.expand_path(Rails.root.join("public","No_Image_Available.png"))
          end 
        else
          @product_img = File.expand_path(Rails.root.join("public","No_Image_Available.png"))
        end
        sheet.column_widths nil, 40
        sheet.add_image(:image_src => @product_img, :noSelect => true, :noMove => true) do |image|
            image.width=300
            image.height=150
            image.start_at 1, sr_no
            image.anchor.from.rowOff = 100000
            image.anchor.from.colOff = 100000
        end

        sheet.add_row [sr_no, "", product.unique_sku, product.length, product.width, product.height, product.material, product.warranty, product.finish, product.vendor_sku, product.name, product.color, product.product_configuration&.name, product.sale_price, product.lead_time, product.remark, product.measurement_unit, product.qty, product.space_tags.pluck(:name).join(","), product.range_tags.pluck(:name).join(",")], :height => 160
        sr_no += 1
      end
    end
    file_name = "#{section_name}-#{index}-catalog-#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    p.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

end

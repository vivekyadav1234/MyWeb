# == Schema Information
#
# Table name: vendors
#
#  id                            :integer          not null, primary key
#  name                          :string
#  address                       :text
#  contact_person                :string
#  contact_number                :string
#  email                         :string
#  pan_no                        :string
#  gst_reg_no                    :string
#  account_holder                :string
#  account_number                :string
#  bank_name                     :string
#  branch_name                   :string
#  ifsc_code                     :string
#  pan_copy_file_name            :string
#  pan_copy_content_type         :string
#  pan_copy_file_size            :integer
#  pan_copy_updated_at           :datetime
#  gst_copy_file_name            :string
#  gst_copy_content_type         :string
#  gst_copy_file_size            :integer
#  gst_copy_updated_at           :datetime
#  cancelled_cheque_file_name    :string
#  cancelled_cheque_content_type :string
#  cancelled_cheque_file_size    :integer
#  cancelled_cheque_updated_at   :datetime
#  city                          :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  user_id                       :integer
#  dd_score                      :float
#

class Vendor < ApplicationRecord
  has_paper_trail
  belongs_to :user , dependent: :destroy

  has_many :vendor_products, dependent: :destroy

  has_many :vendor_category_mappings, dependent: :destroy
  has_many :sub_categories, through: :vendor_category_mappings, source: :sub_category

  has_many :vendor_serviceable_city_mappings, dependent: :destroy
  has_many :serviceable_cities, through: :vendor_serviceable_city_mappings, source: :serviceable_city

  # for mapping vendors against each job element
  has_many :job_element_vendors, dependent: :destroy
  has_many :job_elements, through: :job_element_vendors

  has_many :performa_invoices
  has_many :payments, through: :performa_invoices

  has_many :boqjobs, through: :job_elements, source: :ownerable, source_type: 'Boqjob'
  has_many :modular_jobs, through: :job_elements, source: :ownerable, source_type: 'ModularJob'
  has_many :service_jobs, through: :job_elements, source: :ownerable, source_type: 'ServiceJob'
  has_many :appliance_jobs, through: :job_elements, source: :ownerable, source_type: 'ApplianceJob'
  has_many :custom_jobs, through: :job_elements, source: :ownerable, source_type: 'CustomJob'
  has_many :extra_jobs, through: :job_elements, source: :ownerable, source_type: 'ExtraJob'
  # end mapping vendors against each job element

  has_many :gst_numbers, as: :ownerable, dependent: :destroy
  has_many :contents, as: :ownerable, dependent: :destroy

  validates_presence_of :name, :pan_no, :address, :contact_number, :email
  validates_format_of :pan_no, :with => /[A-Za-z]{5}\d{4}[A-Za-z]{1}/, :message => 'is not in a format of AAAAA9999A'
  validates_uniqueness_of :pan_no, :message => 'pan number already exists'
  # validates_format_of :gst_reg_no, :with => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/ , :message => 'invalid GST number'

  has_attached_file :pan_copy, default_url: "/images/:style/missing1.png"
  do_not_validate_attachment_file_type :pan_copy

  has_attached_file :gst_copy, default_url: "/images/:style/missing2.png"
  do_not_validate_attachment_file_type :gst_copy

  has_attached_file :cancelled_cheque, default_url: "/images/:style/missing3.png"
  do_not_validate_attachment_file_type :cancelled_cheque

  before_create :upcase_fields

  def self.filtered_vendors(filtering_options)
    case filtering_options["filter_by_type"]
    when "city"
      City.find(filtering_options["filter_by_id"]).vendors
    when "sub_category"
      VendorCategory.find(filtering_options["filter_by_id"]).vendors
    when "category"
      Vendor.where(id: VendorCategory.find(filtering_options["filter_by_id"]).sub_categories.joins(:vendors).pluck("vendors.id")).uniq
    end
  end

  # search and filter - this method allows multiple filters simultaneously
  def self.search(search_string, filter_params = {})
    # search query string - partial match ok
    collection = self.all
    if search_string.to_s.present?
      collection = collection.where("CAST(vendors.id AS TEXT) LIKE ? or vendors.name ILIKE ?  or vendors.contact_person ILIKE ?  or vendors.contact_number ILIKE ? or vendors.email ILIKE ? or vendors.pan_no ILIKE ?", "%#{search_string}%", "%#{search_string}%",  "%#{search_string}%", "%#{search_string}%","%#{search_string}%","%#{search_string}%")
    end

    # filter - exact match but case agnostic
    # category
    if filter_params[:category_id].present?
      category = VendorCategory.find filter_params[:category_id]
      sub_category_ids = category.sub_categories.pluck(:id)
      collection = collection.joins(:sub_categories).where(vendor_categories: {id: sub_category_ids}).distinct
    end

    # sub_category
    if filter_params[:sub_category_id].present?
      sub_category = VendorCategory.find filter_params[:sub_category_id]
      collection = collection.where(id: sub_category.vendors.pluck(:id))
    end

    # cities
    if filter_params[:serviceable_city_id].present?
      city = City.find filter_params[:serviceable_city_id]
      collection = collection.where(id: city.vendors.pluck(:id))
    end

    collection
  end

  def self.search_by_attributes(search_param)
    joins(:serviceable_cities).where("CAST(vendors.id AS TEXT) LIKE ? or vendors.name ILIKE ?  or vendors.contact_person ILIKE ?  or vendors.contact_number ILIKE ? or vendors.email ILIKE ? or vendors.pan_no ILIKE ?", "%#{search_param}%", "%#{search_param}%",  "%#{search_param}%", "%#{search_param}%","%#{search_param}%","%#{search_param}%").uniq
  end

  # If user with given email exists, then link that user to this vendor if that user doesn't already have a vendor. If it already has a vendor,
  # then show an error.
  # Otherwise, create a new user with the role :vendor.
  def create_user
    user = User.find_by_email self.email&.strip&.downcase
    if user.blank?
      generated_password = Devise.friendly_token.first(8)
      new_user = self.build_user(name: self.name, email: self.email, password: generated_password, contact: self.contact_number)
      new_user.add_role :vendor
      new_user.save!
      return true
    else
      if user.vendor.blank?
        self.user = user
        return true
      else
        return user.vendor
      end
    end
  end

  def gsts
    gst_numbers.pluck(:gst_reg_no)
  end

  private
    def upcase_fields
      self.pan_no&.upcase!
      self.ifsc_code&.upcase!
      self.account_holder&.upcase!
    end
end

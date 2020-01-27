# == Schema Information
#
# Table name: users
#
#  id                         :integer          not null, primary key
#  provider                   :string           default("email"), not null
#  uid                        :string           default(""), not null
#  encrypted_password         :string           default(""), not null
#  reset_password_token       :string
#  reset_password_sent_at     :datetime
#  remember_created_at        :datetime
#  sign_in_count              :integer          default(0), not null
#  current_sign_in_at         :datetime
#  last_sign_in_at            :datetime
#  current_sign_in_ip         :string
#  last_sign_in_ip            :string
#  confirmation_token         :string
#  confirmed_at               :datetime
#  confirmation_sent_at       :datetime
#  unconfirmed_email          :string
#  name                       :string
#  nickname                   :string
#  image                      :string
#  email                      :string
#  tokens                     :json
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  contact                    :string
#  avatar_file_name           :string
#  avatar_content_type        :string
#  avatar_file_size           :integer
#  avatar_updated_at          :datetime
#  is_active                  :boolean          default(TRUE)
#  pincode                    :string
#  address_proof_file_name    :string
#  address_proof_content_type :string
#  address_proof_file_size    :integer
#  address_proof_updated_at   :datetime
#  gst_number                 :string
#  pan                        :string
#  online_status              :boolean
#  kyc_approved               :boolean          default(FALSE)
#  cm_id                      :integer
#  dummyemail                 :boolean          default(FALSE)
#  last_request_at            :datetime
#  designer_status            :string           default("not_applicable")
#  cm_for_site_supervisor_id  :integer
#  call_type                  :string
#  extension                  :string
#  sales_manager_id           :integer
#  otp_secret_key             :string
#  user_level                 :integer          default(1)
#  parent_id                  :integer
#  invited_by_id              :integer
#  is_champion                :boolean          default(FALSE)
#  is_cm_enable               :boolean          default(TRUE)
#  allow_password_change      :boolean          default(FALSE), not null
#  internal                   :boolean          default(FALSE)
#  catalog_type               :string           default("arrivae"), not null
#

class User < ActiveRecord::Base
  paginates_per 50

  has_paper_trail ignore: [:encrypted_password, :sign_in_count, :current_sign_in_at,
                           :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip, :created_at, :updated_at,
                           :last_request_at]
  #rolify
  rolify strict: true

  #pagination

  # Include default devise modules.
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :omniauthable
  include DeviseTokenAuth::Concerns::User

  # is_champion is the key to define whether the user is Arrivae Champion or not.

  acts_as_tree  #closure_tree gem functionality

  #associations
  # projects created by users (as customers)
  has_many :projects, dependent: :destroy
  has_many :inhouse_calls

  #quotations that are assigned to customers
  has_many :quotations, dependent: :destroy
  #quotations that are created by designers
  has_many :created_quotations, class_name: "Quotation", foreign_key: :designer_id

  #invoice that are assigned to customers
  has_many :invoices, dependent: :destroy
  #quotations that are created by designers
  has_many :created_invoices, class_name: "Invoice", foreign_key: :designer_id

  # created pi_payments
  has_many :created_pi_payments, class_name: 'PiPayment', foreign_key: 'created_by_id'
  has_many :approved_pi_payments, class_name: 'PiPayment', foreign_key: 'approved_by_id'

  #when a lead is qualified, it should be mapped to the user created (or existing if same email ID)
  has_many :related_leads, :class_name => "Lead", :foreign_key => "related_user_id", dependent: :nullify

  has_many :lead_users, dependent: :destroy
  has_many :leads, through: :lead_users
  has_many :comments
  has_many :designs, :class_name => "Design", :foreign_key => "designer_id"
  has_many :proposals, :class_name => "Proposal", :foreign_key => "designer_id"
  #projects which are assigned for designers
  has_many :designer_projects, :class_name => "DesignerProject", :foreign_key => "designer_id", dependent: :destroy
  has_many :assigned_projects, through: :designer_projects, source: :project
  has_many :presentations, :class_name => "Presentation", :foreign_key => "designer_id"
  has_many :price_configurators, as: :pricable, dependent: :destroy
  has_many :project_tasks, dependent: :nullify
  has_many :portfolio_works, dependent: :destroy
  has_many :testimonials

  #designer assigned to CM - self referential obviously
  belongs_to :cm, class_name: "User", optional: true
  has_many :designers_for_cm, class_name: "User", foreign_key: "cm_id"
  has_many :designers_site_measurement_requests, :class_name => "SiteMeasurementRequest", :foreign_key => "designer_id", dependent: :destroy

  #city_gm and cm mapping - self referential many-to-many
  has_many :gm_mappings, class_name: 'GmCmMapping', foreign_key: :cm_id, dependent: :destroy
  has_many :cm_mappings, class_name: 'GmCmMapping', foreign_key: :gm_id, dependent: :destroy
  has_many :gms, through: :gm_mappings
  has_many :cms, through: :cm_mappings

  #design_manager and cm mapping - self referential many-to-many
  has_many :dm_mappings, class_name: 'DmCmMapping', foreign_key: :cm_id, dependent: :destroy
  has_many :dm_cm_mappings, class_name: 'DmCmMapping', foreign_key: :dm_id, dependent: :destroy
  has_many :dms, through: :dm_mappings
  has_many :dm_cms, through: :dm_cm_mappings, source: :cm

  #for site supervisor
  belongs_to :cm_for_site_supervisor, class_name: "User", optional: true
  has_many :sitesupervisors_for_cm, class_name: "User", foreign_key: "cm_for_site_supervisor_id"
  has_many :sitesupervisors_site_measurement_requests, :class_name => "SiteMeasurementRequest", :foreign_key => "sitesupervisor_id"

  # cad role
  has_many :cad_uploads, class_name: "CadUpload", foreign_key: "uploaded_by_id"
  has_many :approved_cad_uploads, class_name: "CadUpload", foreign_key: "approved_by_id"

  # for cs agents
  has_one :assigned_lead_source, class_name: "LeadSource", foreign_key: :assigned_cs_agent_id
  has_one :assigned_lead_type, class_name: "LeadType", foreign_key: :assigned_cs_agent_id
  has_one :assigned_lead_campaign, class_name: "LeadCampaign", foreign_key: :assigned_cs_agent_id

  # for cities
  has_many :city_users, dependent: :destroy
  has_many :cities, through: :zipcodes

  # for vendor
  has_one :vendor, dependent: :destroy

  # for dp-questionnaire
  has_one :dp_questionnaire, class_name: "DpQuestionnaire", foreign_key: "designer_id", dependent: :destroy
  has_one :designer_detail, class_name: "DesignerDetail", foreign_key: "designer_id", dependent: :destroy

  # BoqGlobalConfig presets created by this user
  has_many :created_presets, class_name: "BoqGlobalConfig", foreign_key: "preset_created_by_id", dependent: :destroy
  has_many :mkw_layouts, class_name: "MkwLayout", foreign_key: "created_by_id", dependent: :destroy
  has_many :shangpin_layouts, foreign_key: "created_by_id", dependent: :destroy

  # Different pricing factors for each CM - each CM having one each for MW and MK.
  has_one :cm_mkw_variable_pricing, dependent: :destroy, foreign_key: "cm_id"

  has_attached_file :avatar, styles: {medium: "300x300>", thumb: "100x100>"}, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_attached_file :address_proof, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :address_proof

  #Events of user
  has_many :event_users, dependent: :destroy
  has_many :events, through: :event_users

  #CM Tags Mapping
  has_many :cm_tag_mappings
  has_many :tags, through: :cm_tag_mappings

  #User Zipcode Mapping
  has_many :user_zipcode_mappings, dependent: :destroy
  has_many :zipcodes, through: :user_zipcode_mappings

  # Liked products
  has_many :product_likes, dependent: :destroy
  has_many :liked_products, through: :product_likes, source: :product

  has_many :cm_leads, :class_name => "Lead", :foreign_key => "assigned_cm_id", dependent: :nullify

  #for sales manager
  belongs_to :sales_manager, class_name: "User", optional: true
  has_many :referrers, class_name: "User", foreign_key: "sales_manager_id"
  has_many :referrer_leads, class_name: "Lead", foreign_key: "referrer_id", dependent: :nullify

  has_many :contents, as: :ownerable, dependent: :destroy

  has_many :customer_inspirations, dependent: :destroy

  validates_presence_of :designer_status
  DESIGNER_STATUS_ARRAY = %w(not_applicable pending approved rejected)
  validates_inclusion_of :designer_status, in: DESIGNER_STATUS_ARRAY
  LEVELS = [1, 2, 3]
  validates_inclusion_of :user_level, in: LEVELS
  CATALOG_TYPES = ['arrivae', 'polka']
  validates_inclusion_of :catalog_type, in: CATALOG_TYPES

  validate :non_level1_needs_parent

  COMMON_EXOPHONE = "08033947433"

  include Users::SegmentConcern
  include Users::OtpConcern
  include CsagentConcern
  include ClientConcern
  include CommunityManagerConcern
  include DesignerConcern

  # #store_accessor
  # store_accessor :user_preferences, :platform, :hob, :chimney, :chimney_type, :sink, :dustbin, :bowl_type, :drain_board, :light

  #scopes
  scope :latest_created_at_first, -> { order(created_at: :desc) }
  scope :active_users, -> { where(:is_active => true) }
  scope :online_now, -> { where(online_status: true) }

  #search

  scope :search_users, -> (search_param) {
          where("CAST(users.id AS TEXT) like ? or LOWER(users.name) like ? ", "%#{search_param}%", "%#{search_param}%")
        }

  scope :search, lambda { |query|
    return nil if query.blank?
    # Searches the students table on the 'first_name' and 'last_name' columns.
    # Matches using LIKE, automatically appends '%' to each term.
    # LIKE is case INsensitive with MySQL, however it is case
    # sensitive with PostGreSQL. To make it work in both worlds,
    # we downcase everything.
    # condition query, parse into individual keywords
    terms = query.downcase.split(/\s+/)

    # replace "*" with "%" for wildcard searches,
    # append '%', remove duplicate '%'s
    terms = terms.map { |e|
      (e.gsub("*", "%").prepend("%") + "%").gsub(/%+/, "%")
    }
    # configure number of OR conditions for provision
    # of interpolation arguments. Adjust this if you
    # change the number of OR conditions.
    num_or_conds = 3
    where(
      terms.map { |term|
        "(LOWER(users.name) LIKE ? OR LOWER(users.email) LIKE ? OR CAST(contact AS TEXT) LIKE ?)"
      }.join(" AND "),
    *terms.map { |e| [e] * num_or_conds }.flatten
    )
  }

  # removed role arrivae_champion role
  scope :referrers, -> { joins(:roles).where("roles.name IN (?)", [:broker, :dealer, :employee_referral, :design_partner_referral, :client_referral, :display_dealer_referral, :non_display_dealer_referral, :others, :associate_partner, :non_display_dealer]) }

  scope :sales_managers, -> { with_role(:sales_manager) }

  def self.to_csv
    hash = {name: "Name", email: "Email", contact: "Contact", role_string: "Role"}

    CSV.generate(headers: true) do |csv|
      csv << hash.values

      all.each do |user|
        csv << hash.keys.map { |attr| user.send(attr) }
      end
    end
  end

  # Permanent script, so it is here, not in ScriptModule
  def self.import_designer_extensions(filepath = nil)
    filepath ||= Rails.root.join("app", "data", "Extension List.xlsx")
    workbook = Roo::Spreadsheet.open filepath.to_s

    no_user = []
    no_extension = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header, i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      email = workbook.row(row)[headers["user email id"]]
      extension = workbook.row(row)[headers["extension"]]&.gsub("\"", "")&.strip   #remove starting and ending spaces, quotes, if any
      user = User.find_by(email: email)
      if user.blank?
        no_user << email
        next
      end
      if extension.blank?
        no_extension << email
        next
      end

      user.update!(extension: extension)
    end

    puts "No users with email: "
    pp no_user
    puts "No extensions for email: "
    pp no_extension
    User.with_any_role(:community_manager, :designer).find_all { |u| u.extension.blank? }.count
  end

  def csagent_visible_leads
    lead_ids = lead_users.where.not(claimed: "no").pluck(:lead_id).uniq

    Lead.where(id: lead_ids)
  end

  def role_string
    roles.pluck(:name).join(",")
  end

  def update_password
    password = (0...8).map { (65 + rand(26)).chr }.join
    self.update(:password => password)
    return password
  end

  def designers_for_gm
    cm_ids = cms.map{|cm| cm.designers_for_cm.pluck(:id)}.flatten
    User.where(id: cm_ids)
  end

  # bh - business_head
  def designers_for_bh
    User.with_role(:designer).where.not(cm_id: nil)
  end

  #assign designer to project.
  # This method should not be used. Used the method in Project.rb instead.
  # This method will be removed late as it is redundant.
  def assign_project(designer_id, project)
    project = Project.find project_id
    # project.designer_project_ids = []
    ActiveRecord::Base.transaction do
      # Make sure other designers are unassigned
      project.designer_projects.map { |dp| dp.update!(active: false) }
      designer_project = project.designer_projects.first_or_create!(designer_id: designer_id)
      designer_project.update!(active: true, token_uses_left: 2)
    end
  end

  # def get_emails_for_role
  #   desiner_emails = []
  #   user.each do |u|
  #     user_roles = u.roles.pluck(:name)
  #     if user_roles.include? "designer"
  #       desiner_emails = desiner_emails.push(u.email)
  #     end
  #   end
  # end

  #checks user for active status
  def active_for_authentication?
    #remember to call the super
    #then put our own check to determine "active" state using
    #our own "is_active" column
    if self.is_active?
      super
    else
      raise CanCan::AccessDenied
    end
  end

  def has_dummy_email?
    dummyemail
  end

  def related_leads_by_email
    Lead.where(email: self.email)
  end

  def active_assigned_projects
    assigned_projects.joins(:designer_projects).where(designer_projects: {active: true}).distinct
  end

  def self.migrate_all_leads_to_cm(designer, cm)
    @project = designer.active_assigned_projects
    @project.each do |project|
      lead = project.lead
      if lead.present?
        lead.assigned_cm = cm
        lead.save!
      end
    end
  end

  def is_a_referrer?
    (self.roles.pluck(:name) & Role.referrers.pluck(:name)).any?
  end

  # If this user is a CM, then check his email
  # if this user is a designer, then check his CM's email
  # false for other roles
  def has_modspace_pricing?
    if has_role?(:community_manager)
      MODSPACE_EMAILS.include?(email)
    elsif has_role?(:designer)
      cm.present? && MODSPACE_EMAILS.include?(cm.email)
    else
      false
    end
  end


  def self.pincode_mapping_xlxs(users)
    xl= Axlsx::Package.new
    unassign_xlsx = xl.workbook
    first_row = ["sr_no","name", "email", "type" ,"pincode"]
    unassign_xlsx.add_worksheet(:name => "Mapping Sheet") do |sheet|
      sheet.add_row first_row.map{|ele| ele.titleize}
      users.each_with_index do |user, i|
        row_array = []
        zipcodes = user.zipcodes.pluck(:code).join(',')
        row_array[0] = i+1
        row_array[1] = user.name.titleize
        row_array[2] = user.email
        row_array[3] = user.tags&.pluck(:name)&.join(",")
        row_array[4] = zipcodes
        sheet.add_row row_array
      end
    end
    file_name = "cm_pincode_mapping.xlsx"
    filepath = Rails.root.join("public",file_name)
    xl.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
  end

  private
  # For level 2 and level 3 users, they must be mappged against a lower level user.
  def non_level1_needs_parent
    self.errors.add(:user_level, "#{user_level} and must be mapped to a level #{user_level-1} user.") if user_level > 1 && (parent&.user_level.to_i != user_level-1)
  end
end

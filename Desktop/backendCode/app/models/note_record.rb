# == Schema Information
#
# Table name: note_records
#
#  id                             :integer          not null, primary key
#  notes                          :text
#  ownerable_type                 :string
#  ownerable_id                   :integer
#  user_id                        :integer
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  customer_name                  :string
#  phone                          :string
#  project_name                   :string
#  city                           :string
#  location                       :text
#  project_type                   :string
#  accomodation_type              :string
#  scope_of_work                  :text             default([]), is an Array
#  possession_status              :string
#  have_homeloan                  :string
#  call_back_day                  :string
#  call_back_time                 :string
#  have_floorplan                 :string
#  lead_generator                 :string
#  additional_comments            :text
#  remarks_of_sow                 :string
#  possession_status_date         :string
#  home_value                     :string
#  budget_value                   :string
#  lead_floorplan_file_name       :string
#  lead_floorplan_content_type    :string
#  lead_floorplan_file_size       :integer
#  lead_floorplan_updated_at      :datetime
#  society                        :string
#  lead_source                    :string
#  home_type                      :string
#  cm_comments                    :text
#  designer_comments              :text
#  type_of_space                  :string
#  area_of_sight                  :string
#  status_of_property             :string
#  project_commencement_date      :datetime
#  address_of_site                :string
#  layout_and_photographs_of_site :string
#  intended_date                  :datetime
#  financial_solution_required    :string
#  site_measurement_required      :boolean          default(FALSE)
#  site_measurement_date          :datetime
#  visit_ec                       :boolean          default(FALSE)
#  visit_ec_date                  :datetime
#

class NoteRecord < ApplicationRecord
  has_paper_trail ignore: [:updated_at]
  belongs_to :ownerable, polymorphic: true, optional: true
  has_many :site_layouts

  has_many :alternate_contacts, as: :ownerable, dependent: :destroy

  has_many :lead_questionaire_items, dependent: :destroy

  belongs_to :building_crawler

  #nested attributes
  accepts_nested_attributes_for :lead_questionaire_items, reject_if: :all_blank, :allow_destroy => true

  has_attached_file :lead_floorplan, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :lead_floorplan

  # validates_presence_of [:notes]
  after_save :add_lead_tag

  # Do this ie change setter method instead of adding before_save callback.
  # This will convert strings of format 'Dec-19' to 'Dec-2019'. Others will not be touched.
  # IMP => THIS IS A TEMPORARY PATCH!!! Remove this once Arrivae internal team convert their values to appropriate format.
  def possession_status_date=(value)
    month_array = %w(jan feb mar apr may jun jul aug sep oct nov dec)
    new_value = value
    arr = value.split("-") if value.present?
    # only if the value is in expected format.
    if value.present? && value.include?("-") && arr.last.to_i < 100 && month_array.include?(arr.first.downcase)
      new_value = arr[0] + "-" + (arr.last.to_i + 2000).to_s
      if new_value != value
        self[:possession_status_date] = new_value
      else
        self[:possession_status_date] = value
      end
    else
      self[:possession_status_date] = value
    end
  end

  def add_lead_tag
    lead = self.ownerable
    if lead.project&.assigned_designer&.present?
      return true
    else
      if accomodation_type&.downcase == "office space" || project_type&.downcase == "offices"
        tag = Tag.where(name: "office", tag_type: "lead").first
      elsif check_scope_of_work
        tag = Tag.where(name: "mkw", tag_type: "lead").first
      elsif scope_of_work == ["Interiors without Services"]
        tag = Tag.where(name: "select_cm", tag_type: "lead").first
      else
        tag = Tag.where(name: "full_home", tag_type: "lead").first
      end
      self.ownerable.update(tag_id: tag.id)
      lead.assign_to_cm if lead.lead_status == "qualified"
    end
  end

  private

  # def check_campaign(lead)
  #   true
  # end

  # def check_source(lead)
  #   true
  # end

  def check_scope_of_work
    "Modular Kitchen".in?(self.scope_of_work) || "Modular Wardrobe".in?(self.scope_of_work) || "Modular Kitchen & Wardrobe".in?(self.scope_of_work)
  end

  # def budget_value_check
  #   ["Less than 1.5 Lac", "1.5 - 3 Lacs", "Not Disclosed"].include?(self.budget_value) ? true : false
  # end
end

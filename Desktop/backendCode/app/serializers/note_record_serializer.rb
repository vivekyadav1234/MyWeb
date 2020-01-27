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

class NoteRecordSerializer < ActiveModel::Serializer
  attributes :id, :notes, :created_at, :customer_name, :phone, :project_name, :city,
    :location, :project_type, :accomodation_type, :possession_status, :have_homeloan,
    :call_back_day, :call_back_time, :have_floorplan, :lead_generator, :intended_date,
    :additional_comments, :remarks_of_sow, :possession_status_date, :budget_value,
    :home_value, :lead_floorplan, :scope_of_work, :society, :lead_source, :home_type, :lead_floorplan_url, :cm_comments, :designer_comments,
    :type_of_space,:area_of_site, :status_of_property, :project_commencement_date, :address_of_site, :layout_and_photographs_of_site, :site_layouts, :pincode,
    :financial_solution_required,:lead, :site_measurement_required, :site_measurement_date, :purpose_of_property,
    :visit_ec, :visit_ec_date, :new_society_value, :new_city_value, :new_locality_value, :good_time_to_call, :building_crawler_id
  attribute :site_layouts_mobile

  has_many :lead_questionaire_items

  def intended_date
    object.intended_date&.strftime("%m/%Y")
  end

  def lead_floorplan_url
    object.lead_floorplan.url
  end

  def intended_date
    object.intended_date&.strftime("%m/%Y")
  end
  
  def society_id
    object.building_crawler&.id
  end

  def site_layouts
    urls = []
    object.site_layouts.each do |layout|
      urls.push layout.layout_image.url
    end
    urls
  end

  def site_layouts_mobile
    object.site_layouts.map do |layout|
      {
        url: layout.layout_image.url,
        extension: layout.layout_image_content_type&.partition("/")&.last
      }
    end
  end

  def pincode
    object.ownerable&.pincode
  end

  def lead
    AlternateContactSerializer.new(object.ownerable).serializable_hash
  end

  # def society_data
  #   data_hash = {}
  #   society_detail = object.building_crawler
  #   type_data = []
  #   society_detail.building_crawler_details.each do |detail|
  #     bhk_types = detail.bhk_type.split(",")
  #     bhk_types.each do |bt|
  #       type_array = bt.split("-")
  #       type_data << {
  #         "type": type_array[0],
  #         "area": type_array[1],
  #         "price": type_array[2]
  #       }
  #     end if bhk_types.present?
  #   end if society_detail&.building_crawler_details&.present?
  #   floorplan_data = []
  #   society_detail.building_crawler_floorplans.each do |floorplan|
  #     floorplan_data.push(floorplan.url)
  #   end if society_detail&.building_crawler_floorplans&.present?
  #   possession =  society_detail.building_crawler_details.last.possession if society_detail&.present?
  #   data_hash['bhk'] = type_data.uniq
  #   data_hash['floorplan'] = floorplan_data.uniq 
  #   data_hash['possession'] = possession
  #   data_hash['locality'] =  society_detail&.locality
  #   data_hash['id'] = society_detail&.id
  #   data_hash
  # end
end

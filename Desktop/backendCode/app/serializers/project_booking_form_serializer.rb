# == Schema Information
#
# Table name: project_booking_forms
#
#  id                         :integer          not null, primary key
#  date                       :datetime
#  lead_id                    :integer
#  project_id                 :integer
#  flat_no                    :string
#  floor_no                   :string
#  building_name              :text
#  location                   :text
#  city                       :string
#  pincode                    :string
#  possession_by              :string
#  profession                 :string
#  designation                :string
#  company                    :string
#  professional_details       :string
#  annual_income              :string
#  landline                   :string
#  primary_mobile             :string
#  secondary_mobile           :string
#  primary_email              :string
#  secondary_email            :string
#  current_address            :text
#  order_value                :string
#  order_date                 :date
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  other_professional_details :string
#  billing_address            :text
#  gst_number                 :string
#  billing_name               :string
#  address_type               :text
#

class ProjectBookingFormSerializer < ActiveModel::Serializer
  attributes :id, :lead_id, :project_id, :date, :flat_no, :floor_no, :building_name, :location, :city, :pincode, :possession_by, :profession, :designation, :company, :professional_details, :other_professional_details, :annual_income, :landline, :primary_mobile, :secondary_mobile, :primary_email, :secondary_email, :current_address, :order_value, :order_date, :billing_address,:address_type, :gst_number, :billing_name
 
  attributes :project_booking_form_files

  def project_booking_form_files
  	files = []
  	object.project_booking_form_files.each do |file|
  		files << {
  			id: file.id,
  			project_booking_form_id: file.project_booking_form_id,
  			attachment_file_file_name: file.attachment_file_file_name,
  			attachment_file_content_type: file.attachment_file_content_type,
  			attachment_file_file_size: file.attachment_file_file_size,
  			created_at: file.created_at,
  			url: file.attachment_file.url
  		}
  	end
  	files
  end
end

# == Schema Information
#
# Table name: customer_profiles
#
#  id                                        :integer          not null, primary key
#  name                                      :string
#  email                                     :string
#  contact_no                                :string
#  dob                                       :datetime
#  address_line_1                            :string
#  address_line_2                            :string
#  city                                      :string
#  state                                     :string
#  pincode                                   :string
#  gender                                    :string
#  educational_background                    :string
#  professional_background                   :string
#  sector_employed                           :string
#  income_per_annum                          :string
#  family_status                             :string
#  marital_status                            :string
#  joint_family_status                       :string
#  no_of_family_members                      :string
#  co_decision_maker                         :string
#  co_decision_maker_name                    :string
#  co_decision_maker_email                   :string
#  co_decision_maker_phone                   :string
#  co_decision_maker_dob                     :datetime
#  relation_with_decision_maker              :string
#  co_decision_maker_educational_background  :string
#  co_decision_maker_professional_background :string
#  co_decision_maker_sector_employed         :string
#  co_decision_maker_income_per_annum        :string
#  movein_date                               :datetime
#  purpose_of_house                          :string
#  project_id                                :integer
#  created_at                                :datetime         not null
#  updated_at                                :datetime         not null
#

class CustomerProfile < ApplicationRecord
	belongs_to :project
    
    def self.xl_report
	 package = Axlsx::Package.new
	 xl_report= package.workbook
	 sheet = xl_report.add_worksheet(:name => "Xl Report")
	 header_names= ["Sr No","Lead Id", "Name", "Email", "Contact no", "Dob", "CM Name","Designer Name", "Address line 1", "Address line 2", "City", "State", "Pincode", "Gender", "Educational background", "Professional background", "Sector employed", "Income per annum", "Family status", "Marital status", "Joint family status", "No of family members", "Co decision maker", "Co decision maker name", "Co decision maker email", "Co decision maker phone", "Co decision maker dob", "Relation with decision maker", "Co decision maker educational background", "Co decision maker professional background", "Co decision maker sector employed", "Co decision maker income per annum", "Movein date", "Purpose of house", "Created at", "Updated at"]

	 headers = Hash.new
		header_names.each_with_index do |n, i|
			headers[n] = i
		end
	 sheet.add_row header_names
	 customer_profiles = CustomerProfile.all
	  sr_no = 1

		customer_profiles.each do |customer_profile|
			row_array = []
			row_array[headers["Sr No"]] = sr_no
			row_array[headers["Lead Id"]] = customer_profile.project&.lead&.id
			row_array[headers["Name"]] = customer_profile.name
			row_array[headers["Email"]] = customer_profile.email
			row_array[headers["Contact no"]] = customer_profile.contact_no
			row_array[headers["Dob"]] = customer_profile.dob
			row_array[headers["CM Name"]] = customer_profile.project&.lead&.assigned_cm&.name
			row_array[headers["Designer Name"]] = customer_profile.project&.assigned_designer&.name
			row_array[headers["Address line 1"]] = customer_profile.address_line_1.humanize
			row_array[headers["Address line 2"]] = customer_profile.address_line_2.humanize
			row_array[headers["City"]] = customer_profile.city.humanize
			row_array[headers["State"]] = customer_profile.state.humanize
			row_array[headers["Pincode"]] = customer_profile.pincode.humanize
			row_array[headers["Gender"]] = customer_profile.gender.humanize
			row_array[headers["Educational background"]] = customer_profile.educational_background.humanize
			row_array[headers["Professional background"]] = customer_profile.professional_background.humanize
			row_array[headers["Sector employed"]] = customer_profile.sector_employed.humanize
			row_array[headers["Income per annum"]] = customer_profile.income_per_annum.humanize
			row_array[headers["Family status"]] = customer_profile.family_status.humanize
			row_array[headers["Marital status"]] = customer_profile.marital_status.humanize
			row_array[headers["Joint family status"]] = customer_profile.joint_family_status.humanize
			row_array[headers["No of family members"]] = customer_profile.no_of_family_members.humanize
			row_array[headers["Co decision maker"]] = customer_profile.co_decision_maker.humanize
			row_array[headers["Co decision maker name"]] = customer_profile.co_decision_maker_name.humanize
			row_array[headers["Co decision maker email"]] = customer_profile.co_decision_maker_email.humanize
			row_array[headers["Co decision maker phone"]] = customer_profile.co_decision_maker_phone.humanize
			row_array[headers["Co decision maker dob"]] = customer_profile.co_decision_maker_dob
			row_array[headers["Relation with decision maker"]] = customer_profile.relation_with_decision_maker.humanize
			row_array[headers["Co decision maker educational background"]] = customer_profile.co_decision_maker_educational_background.humanize
			row_array[headers["Co decision maker professional background"]] = customer_profile.co_decision_maker_professional_background.humanize
			row_array[headers["Co decision maker sector employed"]] = customer_profile.co_decision_maker_sector_employed.humanize
			row_array[headers["Co decision maker income per annum"]] = customer_profile.co_decision_maker_income_per_annum.humanize
			row_array[headers["Movein date"]] = customer_profile.movein_date
			row_array[headers["Purpose of house"]] = customer_profile.purpose_of_house.humanize
			row_array[headers["Created at"]] = customer_profile.created_at.strftime("%Y/%m/%d - %I:%M:%S%p")
			row_array[headers["Updated at"]] = customer_profile.updated_at.strftime("%Y/%m/%d - %I:%M:%S%p")

			sheet.add_row row_array
			sr_no += 1
		end
		file_name = "CustomerProfile-Report-#{DateTime.now.in_time_zone('Asia/Kolkata').strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
		filepath = Rails.root.join("tmp",file_name)
		package.serialize(filepath)
		return {file_name: file_name, filepath: filepath}
	end
end

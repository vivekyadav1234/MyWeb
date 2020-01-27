# == Schema Information
#
# Table name: office_moodboard_ppts
#
#  id             :bigint(8)        not null, primary key
#  office_user_id :integer
#  url            :string
#  contact        :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  lead_id        :integer
#  user_id        :integer
#  designer_id    :integer
#

class OfficeMoodboardPpt < ApplicationRecord
	after_initialize :readonly! # This is to make object readonly. You can not create update or delete the object

	# For Smart Share History Report Excel Creation.
	def self.download_smart_share_history_excel(lead_ids)
		smart_share_records = OfficeMoodboardPpt.where(lead_id: lead_ids)
		office_mood_headers = ["Lead ID",
     "Client Name",
     "CM Name",
     "Designer Name",
     "Timestamp of ppt sharing", 
     "URL of the ppt"]

    headers = Hash.new
    office_mood_headers.each_with_index do |n, i|
      headers[n] = i
    end

    p = Axlsx::Package.new
    office_mood_xlsx = p.workbook
    office_mood_xlsx.add_worksheet(:name => "Basic Worksheet") do |sheet|
      sheet.add_row office_mood_headers
      smart_share_records.each do |record|
      	lead = Lead.find(record.lead_id)
      	designer = User.find(record.designer_id) if record.designer_id.present?
	      row_array = []
	      row_array[headers["Timestamp of ppt sharing"]] = record&.created_at&.in_time_zone('Asia/Kolkata')&.strftime("%d-%m-%Y %I:%M:%S %p")
	      row_array[headers["Client Name"]] = lead.name.humanize
	      row_array[headers["Lead ID"]] = record.lead_id
	      row_array[headers["CM Name"]] = designer.cm.name.humanize  if designer.present?
	      row_array[headers["Designer Name"]] = designer.name.humanize if designer.present?
	      row_array[headers["URL of the ppt"]] = record.url
	      sheet.add_row row_array
      end
    end
    file_name = "smart_share_hystory_#{Date.today}.xlsx"
    filepath = Rails.root.join("tmp",file_name)
    p.serialize(filepath)
    return {file_name: file_name, filepath: filepath}
	end
end

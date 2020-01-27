module LeadStatusModule
	def generate_report(start_date)
		p = Axlsx::Package.new
		lead_spread_sheet = p.workbook
		sr_no = 1

		header_names = ['sr_no',
		   'Lead_ID',
		   'Lead_status',
		   'possession_status_date',
		   'intended_date'
		    ]
		   
		   headers = Hash.new
		   header_names.each_with_index do |n, i|
		   	headers[n] = i
		   end
		   lead_ids = []

		   lead_spread_sheet.add_worksheet(:name => "Basic Worksheet") do |sheet|

		   	 sheet.add_row header_names
		   	   leads = Lead.all
		   	   leads.find_each do |lead|

		   	    begin
		   	    	row_array = []
		   	    	row_array[headers['Sr. No.']] = sr_no
		   	    	byebug
		   	    	row_array[headers['ID']] = lead.id
		   	    	row_array[headers['Lead_status']] = Lead.lead_status if Lead.lead_status == 
		   		    "delayed_possession"&& "deslayed_project"
		   		    row_array[headers['possession_status_date']] = NoteRecord.possession_status_date == "" 
		   		    row_array[headers['intended_date']] = NoteRecord.intended_date == ""
		   		    sheet.add_row row_array
		   		    sr_no += 1
		   		rescue StandardError => e

		   		end
	          end
	        end
	        if Rails.env.production?
	        	file_name = "Lead-Report.xlsx"
	        	filepath = Rails.root.join("app", "data", "ProdLeadReport",file_name)
	        else
	        	file_name = "Lead-Report.xlsx"
	        	filepath = Rails.root.join("app", "data", file_name)
	        end
	        p.serialize(filepath)  
	        filepath = filepath.to_s
	        s3 = Aws::S3::Resource.new
	        obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object("production/LeadReport.xlsx")
	        obj.upload_file(filepath, { acl: 'private' }) 
	        if lead_ids.present? 
	        	ReportMailer.skipped_lead_list(lead_ids).deliver_now
	        end
	end
end


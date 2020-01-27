# == Schema Information
#
# Table name: inhouse_calls
#
#  id            :integer          not null, primary key
#  user_id       :integer
#  call_from     :string
#  call_to_id    :integer
#  call_to_type  :string
#  call_to       :string
#  call_for      :string
#  call_response :json
#  call_type     :string           default("outgoing")
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  contact_type  :string           default("call")
#  sid           :string
#  lead_id       :integer
#

class InhouseCall < ApplicationRecord
  require 'net/http'
  require 'uri'
  # require "open-uri"
  belongs_to :user
  belongs_to :lead

  def init_call(from,to)
    uri = URI.parse("https://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Calls/connect.json")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"
    request.set_form_data(
      "From" => from,
      "To" => to,
      "CallerId" => "02248900151",
      "CallType" => "trans"  #Other value possible is 'promo', but that is no longer supported by Exotel. 'trans' stands for Transactional Calls.
    )

    req_options = {
      use_ssl: uri.scheme == "https"
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    return {"code" => "#{response.code}", "body" => "#{response.body}"}
  end

  def check_number(number)
    uri = URI.parse("http://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Numbers/"+number+".json")
    request = Net::HTTP::Get.new(uri)

    request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"


    response = Net::HTTP.start(uri.host, uri.port) {|http|
      alpha = http.request(request)
    }

    return response.body

  end

  def send_sms(from,to,body)
    uri = URI.parse("http://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Sms/send.json")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"
    request.body = "From="+from+"&To="+to+"&Body="+body

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    return response.body
  end

  def call_details
    if self.call_response.present?
      if self.call_response.class == String
        parsed_json = JSON.parse(self.call_response)
      elsif self.call_response.class == Hash
        parsed_json = self.call_response
      end
      begin
        if  parsed_json["body"] !=  'Contact number not present' && parsed_json.has_key?("body") && JSON.parse(parsed_json["body"]).class == Hash && JSON.parse(parsed_json["body"]).has_key?("Call") && JSON.parse(parsed_json["body"])["Call"].has_key?("Sid")
        sid = JSON.parse(parsed_json["body"])["Call"]["Sid"]
        else
          sid =nil
        end
      rescue StandardError => e
        sid =nil
      end

      if sid.present?
        uri = URI.parse("http://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Calls/"+sid+".json")
        request = Net::HTTP::Get.new(uri)

        request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"


        response = Net::HTTP.start(uri.host, uri.port) {|http|
          alpha = http.request(request)
        }

        return response.body
      else
        return nil
      end
    else
      nil
    end

  end

  def sms_details
    sid = nil
    if self.call_response.present?

      if self.call_response.class == String
        parsed_json = JSON.parse(self.call_response)
      elsif self.call_response.class == Hash
        parsed_json = self.call_response
      end


      if parsed_json.has_key?("SMSMessage")
        sid = self.call_response.present? ? JSON.parse(self.call_response)["SMSMessage"]["Sid"] : nil
        uri = URI.parse("http://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/SMS/Messages/"+sid+".json")
        request = Net::HTTP::Get.new(uri)

        request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"


        response = Net::HTTP.start(uri.host, uri.port) {|http|
          alpha = http.request(request)
        }

        return JSON.parse(response.body)
      elsif parsed_json.has_key?("RestException")
        return parsed_json
      end
    else
      return nil
    end

  end

  def plivo_call(agent_no, client_no)
    root_url = Rails.env.production? ? "http://api.arrivae.com" : "https://uatapi.arrivae.com"
    generate_xml(client_no)
    xml_url = "#{root_url}/#{client_no}.xml"
    uri = URI.parse("https://api.plivo.com/v1/Account/MANTZHOTU4NDJHZWM4N2/Call/")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth "MANTZHOTU4NDJHZWM4N2", "ZjY0MmMyMmM0MWU3YTcyODAzNzNmMmJjZGJhNjM5"
    request.set_form_data(
      "from" => "912239612435",
      "to" => "91#{agent_no}",
      "answer_url" => "#{xml_url}",
      "answer_method" => "GET"
    )
    req_options = {
      use_ssl: uri.scheme == "https"
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    return {"code" => "#{response.code}", "body" => "#{response.body}"}
  end

  # This method is to be removed
  # def self.call_excel_report(current_user)
  #   call_histories = InhouseCall.where(contact_type: "call")

  #   package = Axlsx::Package.new
  #   call_spread_sheet = package.workbook
  #   sheet = call_spread_sheet.add_worksheet(:name => "Call Report")

  #   header_names = [
  #     "Lead ID",
  #     "Lead Name",
  #     "User Name",
  #     "User Type",
  #     "Call Timestamp",
  #     "Call Time",
  #     "Call Date",
  #     "Call Duration",
  #     "Call ID"
  #   ]

  #   headers = Hash.new
  #   header_names.each_with_index do |n, i|
  #     headers[n] = i
  #   end
  #   sheet.add_row header_names
  #   call_id = []
  #   call_histories.find_each do |call_history|
  #     begin
  #       lead = call_history.lead
  #       user = call_history.user
  #       call_res = call_history.call_details
  #       res = JSON.parse(call_res) if call_res.present?
  #       if lead.present?
  #         row_array = []
  #         row_array[headers["Lead ID"]] = lead.id
  #         row_array[headers["Lead Name"]] = lead.name
  #         row_array[headers["User Name"]] = user&.name
  #         row_array[headers["User Type"]] = user&.roles&.first&.name&.humanize
  #         row_array[headers["Call Timestamp"]] = call_history.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
  #         row_array[headers["Call Time"]] = call_history.created_at.strftime("%I:%M:%S %p")
  #         row_array[headers["Call Date"]] = call_history.created_at.strftime("%d-%m-%Y")
  #         row_array[headers["Call Duration"]] = res["Call"]["Duration"] if res.present? && res["Call"].present? && res["Call"]["Duration"].present?
  #         row_array[headers["Call ID"]] = call_history.id
  #         sheet.add_row row_array
  #       end
  #      rescue StandardError => e
  #       call_id << call_history.id
  #     end
  #   end

  #   file_name = "Call-Report-#{Time.zone.now.strftime("%Y-%m-%d:%I:%M:%S%p")}.xlsx"
  #   filepath = Rails.root.join("tmp", file_name)
  #   package.serialize(filepath)
  #   ReportMailer.call_report_email(filepath, file_name, current_user).deliver!
  #   File.delete(filepath) if File.exist?(filepath)
  #   # puts "=====================================call_id====================================="
  #   # puts call_id
  # end

  def self.append_to_existing_report(current_user)
    filepath = "#{Rails.root.join('app', 'data', 'Call Report.xlsx')}"
    package = Axlsx::Package.new
    call_spread_sheet = package.workbook
    sheet = call_spread_sheet.add_worksheet(:name => "Call Report")

    header_names = [
      "Lead ID",
      "Lead Name",
      "User Name",
      "User Type",
      "Call Timestamp",
      "Call Time",
      "Call Date",
      "Call Duration",
      "Call ID"
    ]

    headers = Hash.new
    header_names.each_with_index do |n, i|
      headers[n] = i
    end
    sheet.add_row header_names
    existing_call_ids = []

    # read and write existing call report
    if File.exist?(filepath) && Rails.env.production?
      workbook = Roo::Spreadsheet.open filepath
      existing_headers = Hash.new
      workbook.row(1).each_with_index do |header,i|
        existing_headers[header.downcase] = i
      end

      row_number = 0
      ((workbook.first_row + 1)..workbook.last_row).each do |row|
        row_array = []
        row_array[headers["Lead ID"]] = workbook.row(row)[existing_headers['lead id']]
        row_array[headers["Lead Name"]] = workbook.row(row)[existing_headers['lead name']]
        row_array[headers["User Name"]] = workbook.row(row)[existing_headers['user name']]
        row_array[headers["User Type"]] = workbook.row(row)[existing_headers['user type']]
        row_array[headers["Call Timestamp"]] = workbook.row(row)[existing_headers['call timestamp']]
        row_array[headers["Call Time"]] = workbook.row(row)[existing_headers['call time']]
        row_array[headers["Call Date"]] = workbook.row(row)[existing_headers['call date']]
        row_array[headers["Call Duration"]] = workbook.row(row)[existing_headers['call duration']]
        row_array[headers["Call ID"]] = workbook.row(row)[existing_headers['call id']]
        sheet.add_row row_array
        existing_call_ids << workbook.row(row)[existing_headers['call id']]
        row_number += 1
      end
    end

    # get remaining call records
    call_histories = InhouseCall.where(contact_type: "call").where.not(id: existing_call_ids)
    currupted_call_ids = []
    call_histories.find_each do |call_history|
      begin
        res = JSON.parse(call_res) if call_res.present?
        lead = call_history.lead
        user = call_history.user
        call_res = call_history.call_details
        if lead.present?
          row_array = []
          row_array[headers["Lead ID"]] = lead.id
          row_array[headers["Lead Name"]] = lead.name
          row_array[headers["User Name"]] = user&.name
          row_array[headers["User Type"]] = user&.roles&.first&.name&.humanize
          row_array[headers["Call Timestamp"]] = call_history.created_at.strftime("%d-%m-%Y %I:%M:%S %p")
          row_array[headers["Call Time"]] = call_history.created_at.strftime("%I:%M:%S %p")
          row_array[headers["Call Date"]] = call_history.created_at.strftime("%d-%m-%Y")
          row_array[headers["Call Duration"]] = res["Call"]["Duration"] if res.present? && res["Call"].present? && res["Call"]["Duration"].present?
          row_array[headers["Call ID"]] = call_history.id
          sheet.add_row row_array
        end
       rescue StandardError => e
        currupted_call_ids << call_history.id
      end
    end

    file_name = "Call Report.xlsx"
    package.serialize(filepath)
    ReportMailer.call_report_email(filepath, file_name, current_user).deliver!
  end

  private

    def generate_xml(client_no)
      filepath = Rails.root.join("public").join("#{client_no}.xml")
      builder = Nokogiri::XML::Builder.new do |xml|
      xml.Response {
        xml.Record(action: "http://foo.com/get_recording/", startOnDialAnswer: "true", redirect: "false", maxLength: "14400" )
        xml.Dial(callerId: "02239612435") {
          xml.Number  "91#{client_no}"
        }
      }
      end
      File.open(filepath, "wb") do |f|
        f.write(Nokogiri::XML(builder.to_xml).root.to_xml)
        f.close
      end
    end


end

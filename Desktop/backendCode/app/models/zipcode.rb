# == Schema Information
#
# Table name: zipcodes
#
#  id         :integer          not null, primary key
#  code       :string
#  city_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Zipcode < ApplicationRecord
  has_many :user_zipcode_mappings, dependent: :destroy
  has_many :users, through: :user_zipcode_mappings
  belongs_to :city

  # import pincodes from excel
  def self.import
    filepath = "#{Rails.root.join('app', 'data', 'zipcodes.xlsx')}"
    workbook = Roo::Spreadsheet.open filepath

    problems = []

    headers = Hash.new
    workbook.row(1).each_with_index do |header,i|
      headers[header.downcase] = i
    end

    ((workbook.first_row + 1)..workbook.last_row).each do |row|
      code = workbook.row(row)[headers['pincode']]
      city_name = workbook.row(row)[headers['city']]
      landing_page_flag = workbook.row(row)[headers['landing_page']]

      zipcode = Zipcode.where(code: code).first_or_create
      city = City.where(name: city_name).first_or_create
      landing_page_hidden = workbook.row(row)[headers['landing_page']] == 'hide'
      if zipcode.update(city: city, landing_page_hidden: landing_page_hidden)
        next
      else
        problems << "Row #{row} - #{zipcode} - #{city_name}"
      end
    end

    problems
  end
end

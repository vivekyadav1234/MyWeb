# == Schema Information
#
# Table name: web_crawlers
#
#id           :integer  not null, primary key
#name         :string
#group_name   :text
#price        :string
#locality     :text
#bhk_type     :text
#possession   :string
#source      :string

class WebCrawler < ApplicationRecord
  has_many :web_crawl_floorplans
end
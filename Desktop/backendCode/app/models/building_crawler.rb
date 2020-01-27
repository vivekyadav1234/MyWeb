#id:                  integer
#building_name:       string
#group_name:          string
#locality:            string
#city:                string
#created_at:          datetime
#updated_at:          datetime


class BuildingCrawler < ApplicationRecord
  has_many :building_crawler_details
  has_many :building_crawler_floorplans
end

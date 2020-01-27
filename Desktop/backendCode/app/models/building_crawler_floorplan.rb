#id:               integer
#url:              string
#building_crawlers_id: integer
#created_at:      datetime
#updated_at:      datetime


class BuildingCrawlerFloorplan < ApplicationRecord
  belongs_to :building_crawler
end

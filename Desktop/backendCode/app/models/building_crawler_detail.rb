#id:             integer
#type:           text
#possession:     string
#source:         string
#source_id:      string
#building_crawlers_id: integer
#created_at:     datetime
#updated_at:     datetime


class BuildingCrawlerDetail < ApplicationRecord
  belongs_to :building_crawler
end

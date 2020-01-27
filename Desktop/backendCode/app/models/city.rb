# == Schema Information
#
# Table name: cities
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class City < ApplicationRecord
  has_paper_trail
  has_many :city_users, dependent: :destroy
  has_many :users, through: :zipcodes

  has_many :vendor_serviceable_city_mappings, foreign_key: 'serviceable_city_id', dependent: :destroy
  has_many :vendors, through: :vendor_serviceable_city_mappings

  #Zipcode Code Associations
  has_many :zipcodes

  validates_uniqueness_of :name, :case_sensitive => false
end

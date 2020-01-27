# == Schema Information
#
# Table name: hardware_types
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class HardwareType < ApplicationRecord
  has_paper_trail

  has_many :hardware_elements

  validates_presence_of :name
  validates_uniqueness_of :name
end

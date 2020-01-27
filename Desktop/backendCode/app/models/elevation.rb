# == Schema Information
#
# Table name: elevations
#
#  id         :integer          not null, primary key
#  project_id :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Elevation < ApplicationRecord
  belongs_to :project
  has_one :content, as: :ownerable, dependent: :destroy
  has_many :project_handovers, as: :ownerable, dependent: :destroy
end

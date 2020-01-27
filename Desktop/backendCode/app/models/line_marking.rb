# == Schema Information
#
# Table name: line_markings
#
#  id          :integer          not null, primary key
#  project_id  :integer
#  name        :string
#  description :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class LineMarking < ApplicationRecord
  belongs_to :project
  has_one :content, as: :ownerable, dependent: :destroy
  has_many :project_handovers, as: :ownerable, dependent: :destroy
end

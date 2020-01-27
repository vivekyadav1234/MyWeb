# == Schema Information
#
# Table name: reference_images
#
#  id         :integer          not null, primary key
#  project_id :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  panel      :boolean          default(FALSE)
#

class ReferenceImage < ApplicationRecord
  belongs_to :project
  has_one :content, as: :ownerable, dependent: :destroy
  has_many :project_handovers, as: :ownerable, dependent: :destroy
end

# == Schema Information
#
# Table name: combined_doors
#
#  id         :integer          not null, primary key
#  name       :string
#  code       :string
#  price      :float
#  brand_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

# used for choosing door when combining multiple modules in modular wardrobes
class CombinedDoor < ApplicationRecord
  belongs_to :brand, optional: true

  has_one :job_combined_door, dependent: :destroy
  has_one :modular_job, through: :job_combined_door

  validates_presence_of :name
  validates_uniqueness_of :name

  # validates_presence_of :code
  validates_uniqueness_of :code, allow_blank: true
end

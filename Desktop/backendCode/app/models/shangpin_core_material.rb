##Schema==
#core_material           :string

class ShangpinCoreMaterial < ApplicationRecord
  validates_presence_of :core_material
  validates_uniqueness_of :core_material

  has_many :shangpin_job_colors
end

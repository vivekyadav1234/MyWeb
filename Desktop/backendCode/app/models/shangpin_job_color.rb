#Schema==
#color              :string
#core_material_id   :integer


class ShangpinJobColor < ApplicationRecord
  validates_presence_of :color
  validates_uniqueness_of :color

  belongs_to :shangpin_core_material
end

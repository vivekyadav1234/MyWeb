# == Schema Information
#
# Table name: training_materials
#
#  id                   :integer          not null, primary key
#  category_name        :string
#  created_by           :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  training_material_id :integer
#

class TrainingMaterial < ApplicationRecord
  has_many :contents, as: :ownerable, dependent: :destroy
  belongs_to :training_material, class_name: "TrainingMaterial"
  has_many :sub_categories, dependent: :destroy, class_name: 'TrainingMaterial', foreign_key: :training_material_id

  validates_uniqueness_of :category_name, scope: [:training_material_id], :message => 'Category name is already exist'

end

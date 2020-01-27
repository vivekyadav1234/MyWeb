# == Schema Information
#
# Table name: service_subcategories
#
#  id                  :integer          not null, primary key
#  name                :string
#  service_category_id :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  hidden              :boolean          default(FALSE), not null
#

class ServiceSubcategory < ApplicationRecord
  belongs_to :service_category, required: true

  has_many :service_activities, dependent: :destroy

  validates_presence_of :name
  validates_uniqueness_of :name, scope: [:service_category_id]

  scope :not_hidden, -> {where(hidden: false)}

  alias category service_category
  alias activities service_activities
end

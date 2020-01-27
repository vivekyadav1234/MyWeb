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

class ServiceSubcategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at, :service_category_id, :hidden

  attribute :service_category

  def service_category
    object.service_category&.name
  end
end

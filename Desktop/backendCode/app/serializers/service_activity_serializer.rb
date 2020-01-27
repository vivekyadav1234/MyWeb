# == Schema Information
#
# Table name: service_activities
#
#  id                     :integer          not null, primary key
#  name                   :string
#  code                   :string
#  unit                   :string
#  default_base_price     :float
#  installation_price     :float
#  service_category_id    :integer
#  service_subcategory_id :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  description            :string
#

class ServiceActivitySerializer < ActiveModel::Serializer
  attributes :id, :created_at, :updated_at, :name, :code, :unit, :default_base_price, 
      :installation_price, :service_category_id, :service_subcategory_id, :description

  attribute :service_category
  attribute :service_subcategory

  def service_category
    object.service_category&.name
  end

  def service_subcategory
    object.service_subcategory&.name
  end
end

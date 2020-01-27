# == Schema Information
#
# Table name: service_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  hidden     :boolean          default(FALSE)
#

class ServiceCategorySerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at
end

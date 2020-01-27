# == Schema Information
#
# Table name: product_configurations
#
#  id          :integer          not null, primary key
#  name        :string
#  description :text
#  code        :string
#  section_id  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class ProductConfigurationSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :code, :created_at, :updated_at

  belongs_to :section
end

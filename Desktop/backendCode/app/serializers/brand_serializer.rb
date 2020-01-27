# == Schema Information
#
# Table name: brands
#
#  id         :integer          not null, primary key
#  name       :string
#  hardware   :boolean          default(TRUE)
#  addon      :boolean          default(TRUE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class BrandSerializer < ActiveModel::Serializer
  attributes :id, :name, :hardware, :addon, :created_at, :updated_at
end

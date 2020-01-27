# == Schema Information
#
# Table name: vendor_categories
#
#  id                 :integer          not null, primary key
#  category_name      :string
#  parent_category_id :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class VendorCategorySerializer < ActiveModel::Serializer
	attributes :id, :category_name, :created_at, :updated_at
end

# == Schema Information
#
# Table name: cm_mkw_variable_pricings
#
#  id                :integer          not null, primary key
#  full_home_factors :json             not null
#  mkw_factors       :json             not null
#  cm_id             :integer
#

class CmMkwVariablePricingSerializer < ActiveModel::Serializer
  attributes :id, :full_home_factors, :mkw_factors, :cm_id
  attribute :cm

  def cm
    object.cm&.email
  end
end

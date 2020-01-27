# == Schema Information
#
# Table name: skirting_configs
#
#  id              :integer          not null, primary key
#  skirting_type   :string
#  skirting_height :integer
#  price           :float
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  lead_time       :integer          default(0)
#

class SkirtingConfigSerializer < ActiveModel::Serializer
  attributes :id, :skirting_type, :skirting_height, :price, :created_at, :updated_at
end

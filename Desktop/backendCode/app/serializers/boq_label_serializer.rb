# == Schema Information
#
# Table name: boq_labels
#
#  id             :integer          not null, primary key
#  label_name     :string           not null
#  quotation_id   :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class BoqLabelSerializer < ActiveModel::Serializer
  attributes :id, :label_name, :quotation_id, :ownerable_type, :ownerable_id, :created_at, :updated_at
end

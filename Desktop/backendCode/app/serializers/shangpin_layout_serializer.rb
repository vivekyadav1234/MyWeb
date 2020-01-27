# == Schema Information
#
# Table name: shangpin_layouts
#
#  id            :integer          not null, primary key
#  name          :string           not null
#  remark        :text
#  created_by_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class ShangpinLayoutSerializer < ActiveModel::Serializer
  attributes :id, :name, :remark, :created_by_id, :created_at, :updated_at

  attribute :created_by

  def created_by
    {
      email: object.created_by&.email,
      name: object.created_by&.name
    }
  end
end

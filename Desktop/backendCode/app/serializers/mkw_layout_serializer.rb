# == Schema Information
#
# Table name: mkw_layouts
#
#  id            :integer          not null, primary key
#  category      :string
#  name          :string
#  remark        :text
#  global        :boolean          default(FALSE)
#  created_by_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class MkwLayoutSerializer < ActiveModel::Serializer
  attributes :id, :category, :name, :remark, :global, :created_by_id, :created_at, :updated_at

  attribute :created_by

  def created_by
    {
      email: object.created_by&.email,
      name: object.created_by&.name
    }
  end
end

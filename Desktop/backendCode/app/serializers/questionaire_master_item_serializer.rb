# == Schema Information
#
# Table name: questionaire_master_items
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  price      :float            default(0.0), not null
#  is_active  :boolean          default(TRUE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class QuestionaireMasterItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :price, :is_selected

  def is_selected
  	false
  end
end

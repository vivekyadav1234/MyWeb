# == Schema Information
#
# Table name: lead_questionaire_items
#
#  id             :integer          not null, primary key
#  name           :string           not null
#  quantity       :integer          default(1), not null
#  price          :float            default(0.0), not null
#  total          :float            default(0.0), not null
#  note_record_id :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class LeadQuestionaireItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :quantity, :price, :total
end

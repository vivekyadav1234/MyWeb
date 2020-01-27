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

class LeadQuestionaireItem < ApplicationRecord
  
  #associations
  belongs_to :note_record
  
  #validations
  validates :name, :quantity, :price, :total, presence: true
  validate :validate_note_record_id

  #callbacks
  before_save :save_total
  before_save :save_name_in_lowercase

  private

  def save_total
  	self.total = price * quantity
  end

  def save_name_in_lowercase
  	self.name = name.downcase
  end

  def validate_note_record_id
    if note_record.lead_questionaire_items.where(name: name.downcase).last.present?
      errors.add(:name, 'has already been taken')
    end
  end

end

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

class QuestionaireMasterItem < ApplicationRecord
  
  # validations
  validates_presence_of :name
  validates_presence_of :price
  validates_uniqueness_of :name

  #callbacks
  before_save :titleize_name

  private

  def titleize_name
  	self.name = name.titleize
  end
end

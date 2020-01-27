# == Schema Information
#
# Table name: requirement_sheets
#
#  id                     :integer          not null, primary key
#  project_requirement_id :integer
#  space_type             :string
#  space_name             :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class RequirementSheet < ApplicationRecord
  has_paper_trail
  
  belongs_to :project_requirement
  has_many :requirement_space_q_and_as, dependent: :destroy
  accepts_nested_attributes_for :requirement_space_q_and_as 
end

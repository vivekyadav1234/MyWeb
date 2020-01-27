# == Schema Information
#
# Table name: requirement_space_q_and_as
#
#  id                   :integer          not null, primary key
#  requirement_sheet_id :integer
#  question             :text
#  answer               :text
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class RequirementSpaceQAndA < ApplicationRecord
  has_paper_trail
  	
  belongs_to :requirement_sheet
end

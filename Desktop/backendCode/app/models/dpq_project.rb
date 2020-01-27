# == Schema Information
#
# Table name: dpq_projects
#
#  id                                 :integer          not null, primary key
#  customer_name                      :string
#  project_type                       :string
#  budget                             :string
#  area                               :string
#  client_pitches_and_design_approval :string
#  dpq_section_id                     :integer
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  dp_questionnaire_id                :integer
#

class DpqProject < ApplicationRecord
  has_paper_trail
  belongs_to :dpq_section
  belongs_to :dp_questionnaire
end

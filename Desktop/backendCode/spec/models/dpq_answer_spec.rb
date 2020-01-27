# == Schema Information
#
# Table name: dpq_answers
#
#  id                  :integer          not null, primary key
#  dpq_question_id     :integer
#  dp_questionnaire_id :integer
#  answer              :text
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  skipped             :boolean
#

require 'rails_helper'

RSpec.describe DpqAnswer, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

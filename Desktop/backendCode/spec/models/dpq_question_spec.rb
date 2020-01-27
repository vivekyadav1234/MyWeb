# == Schema Information
#
# Table name: dpq_questions
#
#  id             :integer          not null, primary key
#  dpq_section_id :integer
#  question       :text
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'rails_helper'

RSpec.describe DpqQuestion, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

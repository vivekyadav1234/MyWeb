# == Schema Information
#
# Table name: slides
#
#  id              :integer          not null, primary key
#  title           :string
#  serial          :integer          not null
#  data            :json             not null
#  presentation_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

require 'rails_helper'

RSpec.describe Slide, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

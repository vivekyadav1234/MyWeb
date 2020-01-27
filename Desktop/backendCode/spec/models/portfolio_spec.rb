# == Schema Information
#
# Table name: portfolios
#
#  id                           :integer          not null, primary key
#  space                        :string
#  theme                        :string
#  price_cents                  :integer          default(0)
#  segment                      :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  lifestage                    :string
#  element                      :string
#  attachment_file_meta         :text
#  description                  :text
#  user_story_title             :string
#  portfolio_data               :json
#

require 'rails_helper'

RSpec.describe Portfolio, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

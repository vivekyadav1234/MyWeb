# == Schema Information
#
# Table name: portfolio_works
#
#  id                           :integer          not null, primary key
#  name                         :string
#  description                  :text
#  url                          :string
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  user_id                      :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

require 'rails_helper'

RSpec.describe PortfolioWork, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

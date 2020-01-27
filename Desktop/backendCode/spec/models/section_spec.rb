# == Schema Information
#
# Table name: sections
#
#  id                           :integer          not null, primary key
#  name                         :string           not null
#  description                  :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  parent_id                    :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

require 'rails_helper'

RSpec.describe Section, :type => :model do
    it { is_expected.to validate_presence_of(:name) }

    describe "Associations" do
      it { should have_many(:products) }
    end

end

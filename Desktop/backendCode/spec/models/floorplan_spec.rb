# == Schema Information
#
# Table name: floorplans
#
#  id                           :integer          not null, primary key
#  name                         :string
#  project_id                   :integer
#  url                          :string
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

require 'rails_helper'

RSpec.describe Floorplan, :type => :model do

    describe "Associations" do
      it { should belong_to(:project) }
      it { should have_many(:designs) }
    end

end

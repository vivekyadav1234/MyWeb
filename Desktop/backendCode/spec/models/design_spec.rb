# == Schema Information
#
# Table name: designs
#
#  id                           :integer          not null, primary key
#  name                         :string
#  floorplan_id                 :integer
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  designer_id                  :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  status                       :integer          default("pending")
#  design_type                  :string
#

require 'rails_helper'

RSpec.describe Design, :type => :model do

    describe "Associations" do
      it { should belong_to(:designer) }
      it { should belong_to(:floorplan) }
    end

end

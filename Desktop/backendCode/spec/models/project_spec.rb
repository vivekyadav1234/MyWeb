# == Schema Information
#
# Table name: projects
#
#  id                :integer          not null, primary key
#  name              :string
#  user_id           :integer
#  details           :text
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  lead_id           :integer
#  status            :string
#  remarks           :string
#  wip_time          :datetime
#  count_of_calls    :integer
#  status_updated_at :datetime
#  reason_for_lost   :string
#  sub_status        :string
#  new_handover_file :boolean          default(FALSE)
#  last_handover_at  :datetime
#

require 'rails_helper'

RSpec.describe Project, :type => :model do
    it { is_expected.to validate_presence_of(:name) }

    describe "Associations" do
      it { should belong_to(:user) }
      it { should have_many(:floorplans) }
      it { should have_many(:comments) }
    end

end

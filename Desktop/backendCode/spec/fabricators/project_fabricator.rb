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

Fabricator(:project) do
  name { Faker::Name.name }
  details { Faker::Hacker.say_something_smart }
  floorplans(count: 4)
  user
end

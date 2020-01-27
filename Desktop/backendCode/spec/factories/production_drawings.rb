# == Schema Information
#
# Table name: production_drawings
#
#  id                  :integer          not null, primary key
#  project_handover_id :integer
#  line_item_type      :string
#  line_item_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

FactoryGirl.define do
  factory :production_drawing do
    project_handover nil
    line_items nil
  end
end

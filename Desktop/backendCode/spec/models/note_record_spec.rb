# == Schema Information
#
# Table name: note_records
#
#  id                             :integer          not null, primary key
#  notes                          :text
#  ownerable_type                 :string
#  ownerable_id                   :integer
#  user_id                        :integer
#  created_at                     :datetime         not null
#  updated_at                     :datetime         not null
#  customer_name                  :string
#  phone                          :string
#  project_name                   :string
#  city                           :string
#  location                       :text
#  project_type                   :string
#  accomodation_type              :string
#  scope_of_work                  :text             default([]), is an Array
#  possession_status              :string
#  have_homeloan                  :string
#  call_back_day                  :string
#  call_back_time                 :string
#  have_floorplan                 :string
#  lead_generator                 :string
#  additional_comments            :text
#  remarks_of_sow                 :string
#  possession_status_date         :string
#  home_value                     :string
#  budget_value                   :string
#  lead_floorplan_file_name       :string
#  lead_floorplan_content_type    :string
#  lead_floorplan_file_size       :integer
#  lead_floorplan_updated_at      :datetime
#  society                        :string
#  lead_source                    :string
#  home_type                      :string
#  cm_comments                    :text
#  designer_comments              :text
#  type_of_space                  :string
#  area_of_sight                  :string
#  status_of_property             :string
#  project_commencement_date      :datetime
#  address_of_site                :string
#  layout_and_photographs_of_site :string
#  intended_date                  :datetime
#  financial_solution_required    :string
#  site_measurement_required      :boolean          default(FALSE)
#  site_measurement_date          :datetime
#  visit_ec                       :boolean          default(FALSE)
#  visit_ec_date                  :datetime
#

require 'rails_helper'

RSpec.describe NoteRecord, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

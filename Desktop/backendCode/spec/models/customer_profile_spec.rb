# == Schema Information
#
# Table name: customer_profiles
#
#  id                                        :integer          not null, primary key
#  name                                      :string
#  email                                     :string
#  contact_no                                :string
#  dob                                       :datetime
#  address_line_1                            :string
#  address_line_2                            :string
#  city                                      :string
#  state                                     :string
#  pincode                                   :string
#  gender                                    :string
#  educational_background                    :string
#  professional_background                   :string
#  sector_employed                           :string
#  income_per_annum                          :string
#  family_status                             :string
#  marital_status                            :string
#  joint_family_status                       :string
#  no_of_family_members                      :string
#  co_decision_maker                         :string
#  co_decision_maker_name                    :string
#  co_decision_maker_email                   :string
#  co_decision_maker_phone                   :string
#  co_decision_maker_dob                     :datetime
#  relation_with_decision_maker              :string
#  co_decision_maker_educational_background  :string
#  co_decision_maker_professional_background :string
#  co_decision_maker_sector_employed         :string
#  co_decision_maker_income_per_annum        :string
#  movein_date                               :datetime
#  purpose_of_house                          :string
#  project_id                                :integer
#  created_at                                :datetime         not null
#  updated_at                                :datetime         not null
#

require 'rails_helper'

RSpec.describe CustomerProfile, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

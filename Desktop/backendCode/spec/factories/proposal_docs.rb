# == Schema Information
#
# Table name: proposal_docs
#
#  id                     :integer          not null, primary key
#  proposal_id            :integer
#  ownerable_type         :string
#  ownerable_id           :integer
#  is_approved            :boolean
#  approved_at            :datetime
#  discount_value         :float
#  disc_status_updated_by :integer
#  disc_status_updated_at :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  discount_status        :string
#  remark                 :text
#  seen_by_category       :boolean          default(FALSE)
#  customer_remark        :text
#

FactoryGirl.define do
  factory :proposal_doc do
    proposal nil
    ownerable nil
    is_approved "MyString"
    approved_at "2018-03-28 17:50:00"
    discount_value 1.5
    disc_status_updated_by 1
    disc_status_updated_at "2018-03-28 17:50:00"
  end
end

# == Schema Information
#
# Table name: vendors
#
#  id                            :integer          not null, primary key
#  name                          :string
#  address                       :text
#  contact_person                :string
#  contact_number                :string
#  email                         :string
#  pan_no                        :string
#  gst_reg_no                    :string
#  account_holder                :string
#  account_number                :string
#  bank_name                     :string
#  branch_name                   :string
#  ifsc_code                     :string
#  pan_copy_file_name            :string
#  pan_copy_content_type         :string
#  pan_copy_file_size            :integer
#  pan_copy_updated_at           :datetime
#  gst_copy_file_name            :string
#  gst_copy_content_type         :string
#  gst_copy_file_size            :integer
#  gst_copy_updated_at           :datetime
#  cancelled_cheque_file_name    :string
#  cancelled_cheque_content_type :string
#  cancelled_cheque_file_size    :integer
#  cancelled_cheque_updated_at   :datetime
#  city                          :string
#  created_at                    :datetime         not null
#  updated_at                    :datetime         not null
#  user_id                       :integer
#  dd_score                      :float
#

FactoryGirl.define do
  factory :vendor do
    name "MyString"
    address "MyText"
    contact_person "MyString"
    contact_number "MyString"
    email "MyString"
    pan_no "MyString"
    gst_reg_no "MyString"
    account_holder "MyString"
    account_number "MyString"
    bank_name "MyString"
    baranch_name "MyString"
    ifsc_code "MyString"
    pan_copy ""
    gst_copy ""
    cancelled_cheque ""
    city "MyString"
  end
end

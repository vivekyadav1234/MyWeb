# == Schema Information
#
# Table name: users
#
#  id                         :integer          not null, primary key
#  provider                   :string           default("email"), not null
#  uid                        :string           default(""), not null
#  encrypted_password         :string           default(""), not null
#  reset_password_token       :string
#  reset_password_sent_at     :datetime
#  remember_created_at        :datetime
#  sign_in_count              :integer          default(0), not null
#  current_sign_in_at         :datetime
#  last_sign_in_at            :datetime
#  current_sign_in_ip         :string
#  last_sign_in_ip            :string
#  confirmation_token         :string
#  confirmed_at               :datetime
#  confirmation_sent_at       :datetime
#  unconfirmed_email          :string
#  name                       :string
#  nickname                   :string
#  image                      :string
#  email                      :string
#  tokens                     :json
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  contact                    :string
#  avatar_file_name           :string
#  avatar_content_type        :string
#  avatar_file_size           :integer
#  avatar_updated_at          :datetime
#  is_active                  :boolean          default(TRUE)
#  pincode                    :string
#  address_proof_file_name    :string
#  address_proof_content_type :string
#  address_proof_file_size    :integer
#  address_proof_updated_at   :datetime
#  gst_number                 :string
#  pan                        :string
#  online_status              :boolean
#  kyc_approved               :boolean          default(FALSE)
#  cm_id                      :integer
#  dummyemail                 :boolean          default(FALSE)
#  last_request_at            :datetime
#  designer_status            :string           default("not_applicable")
#  cm_for_site_supervisor_id  :integer
#  call_type                  :string
#  extension                  :string
#  sales_manager_id           :integer
#  otp_secret_key             :string
#  user_level                 :integer          default(1)
#  parent_id                  :integer
#  invited_by_id              :integer
#  is_champion                :boolean          default(FALSE)
#  is_cm_enable               :boolean          default(TRUE)
#  allow_password_change      :boolean          default(FALSE), not null
#  internal                   :boolean          default(FALSE)
#  catalog_type               :string           default("arrivae"), not null
#

Fabricator(:user) do
  name { Faker::Name.name }
  email { Faker::Internet.email }
  password { "abcd1234" }
  projects(count: 4)
end

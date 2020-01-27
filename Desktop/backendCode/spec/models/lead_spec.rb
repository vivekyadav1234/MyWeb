# == Schema Information
#
# Table name: leads
#
#  id                      :integer          not null, primary key
#  name                    :string
#  email                   :string
#  contact                 :string
#  address                 :text
#  details                 :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  city                    :string
#  pincode                 :string
#  status_updated_at       :datetime
#  lead_status             :string           default("not_attempted"), not null
#  source                  :string           default("digital"), not null
#  follow_up_time          :datetime
#  lost_remark             :text
#  created_by              :integer
#  dummyemail              :boolean          default(FALSE)
#  related_user_id         :integer
#  lead_escalated          :boolean          default(FALSE), not null
#  reason_for_escalation   :string
#  lead_campaign_id        :integer
#  lead_source_id          :integer
#  lead_type_id            :integer
#  not_contactable_counter :integer          default(0), not null
#  drop_reason             :string
#  duplicate               :boolean          default(FALSE)
#  remark                  :string
#  lost_reason             :string
#  instagram_handle        :string
#  lead_cv_file_name       :string
#  lead_cv_content_type    :string
#  lead_cv_file_size       :integer
#  lead_cv_updated_at      :datetime
#  tag_id                  :integer
#  assigned_cm_id          :integer
#  referrer_id             :integer
#  referrer_type           :string
#  is_contact_visible      :boolean          default(FALSE)
#  from_fasttrack_page     :boolean          default(FALSE), not null
#  lead_utm_content_id     :integer
#  lead_utm_medium_id      :integer
#  lead_utm_term_id        :integer
#

require 'rails_helper'

RSpec.describe Lead, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

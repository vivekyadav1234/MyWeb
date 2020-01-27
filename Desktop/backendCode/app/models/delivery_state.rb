# == Schema Information
#
# Table name: delivery_states
#
#  id              :integer          not null, primary key
#  job_element_id  :integer
#  remarks         :text
#  created_by      :integer
#  status          :string
#  dispached_items :text
#  pending_items   :text
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class DeliveryState < ApplicationRecord
  belongs_to :job_element

  STATUS = ["partial", "completed"]
  validates_inclusion_of :status, in: STATUS

end

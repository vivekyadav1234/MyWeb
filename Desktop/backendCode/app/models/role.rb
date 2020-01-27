
# == Schema Information
#
# Table name: roles
#
#  id            :integer          not null, primary key
#  name          :string
#  resource_type :string
#  resource_id   :integer
#  created_at    :datetime
#  updated_at    :datetime
#

class Role < ApplicationRecord
  # 'category' roles after splitting into multiple roles. Note that category_head is separate.
  CATEGORY_ROLES = ['category_panel', 'category_non_panel', 'category_services']
  #associations
  has_and_belongs_to_many :users, :join_table => :users_roles

  belongs_to :resource,
             :polymorphic => true,
             :optional => true

  #validations
  validates :resource_type,
            :inclusion => {:in => Rolify.resource_types},
            :allow_nil => true

  scopify
  scope :referrers, -> { where name: ["broker", "dealer", "employee_referral", "design_partner_referral", "client_referral", "display_dealer_referral", "non_display_dealer_referral", "others",  "associate_partner", "non_display_dealer"] }
end

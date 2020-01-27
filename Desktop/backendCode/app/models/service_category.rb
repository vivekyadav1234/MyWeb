# == Schema Information
#
# Table name: service_categories
#
#  id         :integer          not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  hidden     :boolean          default(FALSE)
#

class ServiceCategory < ApplicationRecord
  has_many :service_subcategories, dependent: :destroy
  has_many :service_activities, dependent: :destroy

  validates_presence_of :name
  validates_uniqueness_of :name

  #IMP NOTE - All queries will run in this scope only. Use unscope block to override it.
  default_scope { where(hidden: false) }

  EXPIRED_LEADS = "Expired Leads"

  alias subcategories service_subcategories
  alias activities service_activities

  def ServiceCategory.hidden_category
    ServiceCategory.unscoped.find_by_name("Expired Leads")
  end
end

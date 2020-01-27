# == Schema Information
#
# Table name: service_activities
#
#  id                     :integer          not null, primary key
#  name                   :string
#  code                   :string
#  unit                   :string
#  default_base_price     :float
#  installation_price     :float
#  service_category_id    :integer
#  service_subcategory_id :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  description            :string
#

class ServiceActivity < ApplicationRecord
  belongs_to :service_category, required: true
  belongs_to :service_subcategory, required: true

  has_many :service_jobs

  validates_presence_of :name
  validates_presence_of :code
  validates_uniqueness_of :code

  alias category service_category
  alias subcategory service_subcategory

  # Do this ie change setter method instead of adding before_save callback.
  def unit=(value)
    if value
      self[:unit] = value.downcase
    else
      self[:unit] = value
    end
  end

  # IMPORTANT - This method should no longer be used as the factors for base and installation rates
  # are different.
  # Please use the method in ServiceJob instead.
  def final_price
    default_base_price.to_f + installation_price.to_f
  end

  # if its category or sub-category is hidden, then a service is hidden
  def hidden?
    service_category&.hidden || service_subcategory&.hidden
  end
end

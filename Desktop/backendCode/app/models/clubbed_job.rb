# == Schema Information
#
# Table name: clubbed_jobs
#
#  id           :integer          not null, primary key
#  quotation_id :integer
#  label        :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class ClubbedJob < ApplicationRecord
  
  belongs_to :quotation

  has_many :boqjobs
  has_many :modular_jobs
  has_many :service_jobs
  has_many :custom_jobs
  has_many :appliance_jobs
  has_many :extra_jobs
  has_many :shangpin_jobs
  
  has_many :job_elements, as: :ownerable, dependent: :destroy
  has_many :vendors, through: :job_elements
end

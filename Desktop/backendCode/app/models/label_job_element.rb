# == Schema Information
#
# Table name: label_job_elements
#
#  id             :integer          not null, primary key
#  boq_label_id   :integer
#  job_element_id :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

# Mapping table for n:n relationship between BoqLabel and JobElement.
class LabelJobElement < ApplicationRecord
  belongs_to :boq_label, required: true
  belongs_to :job_element, required: true
end

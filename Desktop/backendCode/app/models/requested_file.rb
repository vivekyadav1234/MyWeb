# == Schema Information
#
# Table name: requested_files
#
#  id           :integer          not null, primary key
#  raised_by_id :integer
#  resolved     :boolean          default(FALSE)
#  project_id   :integer
#  resolved_on  :datetime
#  remarks      :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

class RequestedFile < ApplicationRecord
  belongs_to :project
end
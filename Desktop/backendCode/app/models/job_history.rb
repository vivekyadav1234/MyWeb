# == Schema Information
#
# Table name: job_histories
#
#  id         :integer          not null, primary key
#  job_type   :string
#  job_name   :string
#  run_at     :datetime
#  info       :text
#  job_id     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class JobHistory < ApplicationRecord
	has_paper_trail
end

# == Schema Information
#
# Table name: send_to_factory_urls
#
#  id         :integer          not null, primary key
#  project_id :integer
#  content_id :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class SendToFactoryUrl < ApplicationRecord
  belongs_to :project
  has_many :contents, as: :ownerable, dependent: :destroy
end

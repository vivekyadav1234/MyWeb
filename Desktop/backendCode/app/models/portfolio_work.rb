# == Schema Information
#
# Table name: portfolio_works
#
#  id                           :integer          not null, primary key
#  name                         :string
#  description                  :text
#  url                          :string
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  user_id                      :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

class PortfolioWork < ApplicationRecord
  # has_paper_trail

  belongs_to :user
  #attachment_file
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :attachment_file

  validates_presence_of :name
end

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

class PortfolioWorkSerializer < ActiveModel::Serializer
  attributes :name, :description, :url, :attachment_file, :id, :attachment_file_type

  belongs_to :user

  	def attachment_file_type
      object.attachment_file_content_type
    end
end

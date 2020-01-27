# == Schema Information
#
# Table name: contents
#
#  id                    :integer          not null, primary key
#  ownerable_type        :string
#  ownerable_id          :integer
#  document_file_name    :string
#  document_content_type :string
#  document_file_size    :integer
#  document_updated_at   :datetime
#  scope                 :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class ContentSerializer
	include FastJsonapi::ObjectSerializer

	def serializable_hash
		data = super
		data[:data]
	end
	attributes :id,:document, :document_file_name, :created_at

  # attribute :needed do |object|
  #   if object.ownerable.present?
  #     object.ownerable.get_details
  #   else  
  #     "no product"
  #   end
  # end
end

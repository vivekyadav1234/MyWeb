# == Schema Information
#
# Table name: documents_urls
#
#  id          :integer          not null, primary key
#  url         :text
#  type_of_url :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class DocumentsUrl < ApplicationRecord
end

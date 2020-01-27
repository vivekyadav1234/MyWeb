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

require 'rails_helper'

RSpec.describe Content, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

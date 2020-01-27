# == Schema Information
#
# Table name: boq_and_ppt_uploads
#
#  id                   :integer          not null, primary key
#  project_id           :integer
#  upload_file_name     :string
#  upload_content_type  :string
#  upload_file_size     :integer
#  upload_updated_at    :datetime
#  upload_type          :string
#  shared_with_customer :boolean
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  name                 :string
#

require 'rails_helper'

RSpec.describe BoqAndPptUpload, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

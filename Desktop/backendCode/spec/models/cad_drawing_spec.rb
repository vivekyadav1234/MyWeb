# == Schema Information
#
# Table name: cad_drawings
#
#  id                       :integer          not null, primary key
#  project_id               :integer
#  cad_drawing_file_name    :string
#  cad_drawing_content_type :string
#  cad_drawing_file_size    :integer
#  cad_drawing_updated_at   :datetime
#  name                     :string
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  panel                    :boolean          default(FALSE)
#

require 'rails_helper'

RSpec.describe CadDrawing, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

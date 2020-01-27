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

class CadDrawing < ApplicationRecord
  has_paper_trail

  belongs_to :project
  has_many :project_handovers, as: :ownerable, dependent: :destroy

  has_attached_file :cad_drawing, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :cad_drawing

end

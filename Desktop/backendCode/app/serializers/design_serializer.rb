# == Schema Information
#
# Table name: designs
#
#  id                           :integer          not null, primary key
#  name                         :string
#  floorplan_id                 :integer
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  designer_id                  :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  status                       :integer          default("pending")
#  design_type                  :string
#

class DesignSerializer < ActiveModel::Serializer
  attributes :id, :name, :details,:attachment_file, :status, :design_type, :attachment_file_content_type
  belongs_to :designer
  

end

# == Schema Information
#
# Table name: shutter_finish_shades
#
#  id                :integer          not null, primary key
#  shutter_finish_id :integer
#  shade_id          :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class ShutterFinishShade < ApplicationRecord
  has_paper_trail

  belongs_to :shutter_finish, required: true
  belongs_to :shade, required: true

  validates_uniqueness_of :shade_id, scope: [:shutter_finish_id]
end

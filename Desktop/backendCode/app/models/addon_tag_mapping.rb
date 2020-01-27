# == Schema Information
#
# Table name: addon_tag_mappings
#
#  id         :integer          not null, primary key
#  addon_id   :integer
#  tag_id     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class AddonTagMapping < ApplicationRecord
  belongs_to :addon, required: true
  belongs_to :tag, required: true

  validates_uniqueness_of :addon_id, scope: [:tag_id]

  accepts_nested_attributes_for :tag

  validate :tag_type_must_addon

  private
  def tag_type_must_addon
    errors.add(:tag_type, "Only Addon Tag Types are allowed for tagging addons.") unless tag.tag_type == "addons"
  end
end

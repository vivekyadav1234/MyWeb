# == Schema Information
#
# Table name: line_item_boms
#
#  id             :integer          not null, primary key
#  content_id     :integer
#  line_item_type :string
#  line_item_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class LineItemBom < ApplicationRecord
  belongs_to :line_item, polymorphic: true
  belongs_to :content, required: true

  validates_uniqueness_of :content_id, scope: [:line_item_type, :line_item_id]
end

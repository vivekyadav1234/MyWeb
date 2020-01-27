# == Schema Information
#
# Table name: production_drawings
#
#  id                  :integer          not null, primary key
#  project_handover_id :integer
#  line_item_type      :string
#  line_item_id        :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class ProductionDrawing < ApplicationRecord
  has_paper_trail

  belongs_to :project_handover, optional: true
  belongs_to :line_item, polymorphic: true
  validates_uniqueness_of :project_handover_id, scope: [:line_item_type, :line_item_id]

  before_create :destroy_unwanted_drawings

  private
  	def destroy_unwanted_drawings
  		if project_handover_id.nil?
  			ProductionDrawing.where(line_item_type: line_item_type, line_item_id: line_item_id).each do |prs|
  				prs.destroy!
  			end
  		else
  			ProductionDrawing.find_by(line_item_type: line_item_type, line_item_id: line_item_id, project_handover_id: nil).try(:destroy)
  		end
  	end
  
end

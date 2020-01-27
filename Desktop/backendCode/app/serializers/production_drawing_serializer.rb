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

class ProductionDrawingSerializer
  include FastJsonapi::ObjectSerializer

  def serializable_hash
    data = super
    data[:data]
  end

  attributes :id, :created_at, :updated_at

  attribute :file_details do |object|
    if object.project_handover.present?
      object.project_handover.get_file_details
    else
      "No production"
    end
  end

end

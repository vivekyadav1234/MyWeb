class QuotationSplitSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id, :reference_number, :project_id

  attribute :line_items do |object|
    line_items = object.line_items_with_production_drawings
  end

end
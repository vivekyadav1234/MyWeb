class MliAttributeWithOptionsSerializer < ActiveModel::Serializer
  attributes :id, :attr_name, :attr_type, :attr_data_type, :reference_table_name, :created_at, :updated_at, 
    :master_line_item_id, :required
  attribute :dropdown_options

  def dropdown_options
    unless object.attr_type == 'dropdown' && object.attr_data_type == 'reference'
      return []
    else
      return object.get_dropdown_options
    end
  end
end

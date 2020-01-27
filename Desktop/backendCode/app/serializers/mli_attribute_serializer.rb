# == Schema Information
#
# Table name: mli_attributes
#
#  id                   :integer          not null, primary key
#  attr_name            :string           not null
#  attr_type            :string           default("text_field")
#  attr_data_type       :string           default("string")
#  reference_table_name :string
#  required             :boolean          default(FALSE)
#  master_line_item_id  :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

class MliAttributeSerializer < ActiveModel::Serializer
  attributes :id, :attr_name, :attr_type, :attr_data_type, :reference_table_name, :created_at, :updated_at, 
    :master_line_item_id, :required
end

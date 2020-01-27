# == Schema Information
#
# Table name: master_line_items
#
#  id         :integer          not null, primary key
#  mli_name   :string           not null
#  mli_type   :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class MasterLineItem < ApplicationRecord
  has_paper_trail

  validates_presence_of [:mli_name, :mli_type]
  validates_uniqueness_of :mli_name, scope: [:mli_type]

  MLI_TYPES = ['indoline', 'lakhs_modular', 'loose_furniture']
  validates_inclusion_of :mli_type, in: MLI_TYPES

  has_many :mli_attributes, dependent: :destroy
  has_many :vendor_products, dependent: :destroy

  scope :indoline, ->{ where(mli_type: 'indoline') }
  scope :lakhs_modular, ->{ where(mli_type: 'lakhs_modular') }
  scope :loose_furniture, ->{ where(mli_type: 'loose_furniture') }

  # Add a master attribute for this mli.
  def add_mli_attribute(mli_attribute)
    self.mli_attributes << mli_attribute
  end

  # Remove a master attribute for this mli.
  def remove_mli_attribute(mli_attribute)
    self.mli_attributes.delete(mli_attribute.id)
  end
end

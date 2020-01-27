# == Schema Information
#
# Table name: gst_numbers
#
#  id             :integer          not null, primary key
#  gst_reg_no     :string
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class GstNumber < ApplicationRecord
  validates_uniqueness_of :gst_reg_no, scope: :ownerable, :message => 'GST number already exists'
  belongs_to :ownerable, polymorphic: true

  def GstNumber.add_gst_number(gsts, ownerable_id, ownerable_type)
    owner = ownerable_type.constantize.find_by_id(ownerable_id)
    owner.gst_numbers.destroy_all
    gsts.each do |gst|
      owner.gst_numbers.create!(gst_reg_no: gst[:gst_reg_no])
    end
  end
end

# == Schema Information
#
# Table name: scope_spaces
#
#  id               :integer          not null, primary key
#  scope_of_work_id :integer
#  space_name       :string
#  space_type       :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class ScopeSpace < ApplicationRecord
  has_paper_trail

  belongs_to :scope_of_work
  has_many :scope_qnas, dependent: :destroy
  accepts_nested_attributes_for :scope_qnas
end

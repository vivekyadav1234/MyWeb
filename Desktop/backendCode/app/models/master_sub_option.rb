# == Schema Information
#
# Table name: master_sub_options
#
#  id               :integer          not null, primary key
#  name             :string
#  master_option_id :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#

class MasterSubOption < ApplicationRecord
  has_paper_trail
  belongs_to :master_option
  has_many :catalogue_options
end

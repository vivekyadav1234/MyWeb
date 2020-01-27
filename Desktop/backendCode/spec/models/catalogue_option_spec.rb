# == Schema Information
#
# Table name: catalogue_options
#
#  id                   :integer          not null, primary key
#  name                 :string
#  master_sub_option_id :integer
#  minimum_price        :float
#  maximum_price        :float
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#

require 'rails_helper'

RSpec.describe CatalogueOption, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

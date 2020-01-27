# == Schema Information
#
# Table name: price_configurators
#
#  id                 :integer          not null, primary key
#  total_price_cents  :integer          default(0)
#  pricable_type      :string
#  pricable_id        :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  food_type          :string
#  food               :string
#  family_size        :integer
#  utensil_used       :string
#  vegetable_cleaning :string
#  storage_utensils   :string
#  kind_of_food       :string
#  size_of_utensils   :string
#  habit              :string
#  platform           :string
#  hob                :string
#  chimney            :string
#  chimney_type       :string
#  sink               :string
#  dustbin            :string
#  bowl_type          :string
#  drain_board        :integer
#  light              :string
#  food_option        :string
#  cleaning_frequency :integer          default(0)
#  preparation_area   :string
#  kitchen_type       :string
#  finish_type        :string
#

require 'rails_helper'

RSpec.describe PriceConfigurator, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

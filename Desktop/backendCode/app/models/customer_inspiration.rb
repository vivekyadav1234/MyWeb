# == Schema Information
#
# Table name: customer_inspirations
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class CustomerInspiration < ApplicationRecord
  belongs_to :user
  has_one :content, as: :ownerable, dependent: :destroy
end

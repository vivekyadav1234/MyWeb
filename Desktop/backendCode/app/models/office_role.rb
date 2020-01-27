# == Schema Information
#
# Table name: office_roles
#
#  id         :bigint(8)        not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  is_active  :boolean          default(TRUE)
#

class OfficeRole < ApplicationRecord
    has_many :office_users
end
  
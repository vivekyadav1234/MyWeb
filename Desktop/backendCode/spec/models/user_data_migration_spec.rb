# == Schema Information
#
# Table name: user_data_migrations
#
#  id            :integer          not null, primary key
#  from          :integer
#  to            :integer
#  migrated_data :json             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

require 'rails_helper'

RSpec.describe UserDataMigration, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

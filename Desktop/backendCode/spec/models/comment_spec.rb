# == Schema Information
#
# Table name: comments
#
#  id               :integer          not null, primary key
#  user_id          :integer
#  commentable_type :string
#  commentable_id   :integer
#  comment_for      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  body             :string
#

require 'rails_helper'

RSpec.describe Comment, :type => :model do

    describe "Associations" do
      it { should belong_to(:commentable) }
      it { should belong_to(:user) }
    end

end

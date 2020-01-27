# == Schema Information
#
# Table name: office_project_users
#
#  id                :bigint(8)        not null, primary key
#  office_user_id    :integer
#  office_project_id :integer
#  office_role_id    :integer
#  is_active         :boolean          default(TRUE)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class OfficeProjectUser < ApplicationRecord
    belongs_to :office_user, optional: true
    belongs_to :office_project, optional: true
    belongs_to :user, optional: true
    belongs_to :project, optional: true
end
  
class OfficeOmcm < ApplicationRecord
    belongs_to :office_user
    belongs_to :user
end
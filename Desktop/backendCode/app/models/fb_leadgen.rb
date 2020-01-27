# Don't add ANY validations as we want a record to be saved everytime FB pings our webhook.
class FbLeadgen < ApplicationRecord
  belongs_to :lead, optional: true


end

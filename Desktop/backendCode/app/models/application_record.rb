class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  MAX_INTEGER = 2147483647 #(for limit 4)
end

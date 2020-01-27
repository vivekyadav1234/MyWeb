# == Schema Information
#
# Table name: portfolios
#
#  id                           :integer          not null, primary key
#  space                        :string
#  theme                        :string
#  price_cents                  :integer          default(0)
#  segment                      :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  lifestage                    :string
#  element                      :string
#  attachment_file_meta         :text
#  description                  :text
#  user_story_title             :string
#  portfolio_data               :json
#

class Portfolio < ApplicationRecord

  has_paper_trail
  #attachment_file
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png"
  do_not_validate_attachment_file_type :attachment_file

  #filters
  scope :segment_filter, lambda {|segment|
		# return nil if segment.blank?
		where(segment: segment) if segment.present?
	}

  scope :space_filter, lambda {|space|
		# return nil if space.blank?
		where(space: space) if space.present?
	}

  scope :lifestage_filter, lambda {|lifestage|
    # return nil if space.blank?
    where(lifestage: lifestage) if lifestage.present?
  }

  scope :element_filter, lambda {|element|
    # return nil if space.blank?
    where(element: element) if element.present?
  }

  scope :theme_filter, lambda {|theme|
		# return nil if theme.blank?
		where(theme: theme) if theme.present?
	}

end

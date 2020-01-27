# This concern contains the functionality necessary for a User with respect to segments, 
# eg panel, non_panel etc. Started in Nov 2019..
module Users::SegmentConcern
  extend ActiveSupport::Concern

  # For category roles. Optimized.
  def segment_edit_access?(segment_name)
    role_name = roles.last.name
    if role_name.in?(Role::CATEGORY_ROLES)
      return SEGMENT_ROLE_MAPPING[role_name] == segment_name
    else
      return false
    end
  end
end

# This concern contains the functionality necessary for collecting with the split of jobs into various segments.
# Applicable to ALL Quotation job classes.
module JobSplitConcern
  extend ActiveSupport::Concern

  included do
    # This scope must be kept flexible and dynamic ie even if the segments expand from the initial 3, this scope
    # should work. Similarly, it should work for all job classes.
    # If in the category split screen, a line item is tagged, then that tagging supersedes default tagging. So, 
    # an MKW line item tagged as non_panel in the split screen by Category will be considered non_panel for 
    # this scope, even though it would have been considered panel by default if not explicitly tagged.
    scope :with_segment, -> (segment) {
      if segment == BOQ_LI_SEGMENT_MAPPING[self.to_s]
        left_outer_joins(:tag).where("tags.id IS NULL").
          or( left_outer_joins(:tag).where("tags.name IN (?)", SPLITS_FOR_SEGMENT[segment]) ).distinct
      else
        left_outer_joins(:tag).where("tags.name IN (?)", SPLITS_FOR_SEGMENT[segment]).distinct
      end
    }
  end

  def get_segment
    if tag.blank?
      BOQ_LI_SEGMENT_MAPPING[self.class.to_s]
    else
      SPLIT_SEGMENT_MAPPING[tag.name]
    end
  end
end

# This concern contains the functionality necessary for a BOQ with respect to segments, eg panel, non_panel etc.
module Quotations::SegmentConcern
  extend ActiveSupport::Concern

  included do
    attr_accessor :segments

    # This scope will return BOQs having at least 1 line item of the current_user's category role.
    scope :for_category_role, -> (current_user) {
      role_name = current_user.roles.last.name
      if role_name.in?(SEGMENT_ROLE_MAPPING.keys)
        segment_name = SEGMENT_ROLE_MAPPING[role_name]
        with_segment(segment_name)
      end
    }

    # Select BOQs with the given segment.
    # Eg for panel segment, it will include BOQs with at least 1 line item that is of type panel.
    scope :with_segment, -> (segment) {
      q1 = joins(:boqjobs).where(boqjobs: {id: Boqjob.with_segment(segment)})
      q2 = joins(:modular_jobs).where(modular_jobs: {id: ModularJob.with_segment(segment)})
      q3 = joins(:service_jobs).where(service_jobs: {id: ServiceJob.with_segment(segment)})
      q4 = joins(:custom_jobs).where(custom_jobs: {id: CustomJob.with_segment(segment)})
      q5 = joins(:appliance_jobs).where(appliance_jobs: {id: ApplianceJob.with_segment(segment)})
      q6 = joins(:extra_jobs).where(extra_jobs: {id: ExtraJob.with_segment(segment)})
      q7 = joins(:shangpin_jobs).where(shangpin_jobs: {id: ShangpinJob.with_segment(segment)})
      Quotation.where(id: q1).
        or( Quotation.where(id: q2).
          or( Quotation.where(id: q3).
            or( Quotation.where(id: q4).
              or( Quotation.where(id: q5). 
                or( Quotation.where(id: q6).
                  or( Quotation.where(id: q7) )
                )
              )
            )
          ) 
        ).distinct
    }
  end

  # Get an array of segments applicable to this BOQ.
  def get_segments(refresh=false)
    if segments.present? && !refresh
      return segments
    else
      arr = []
      CATEGORY_SEGMENTS.each do |segment|
        arr.push(segment) if has_segment?(segment)
      end

      segments = arr
      return segments
    end
  end

  # Whether this BOQ has the segment queried.
  def has_segment?(segment)
    boqjobs.with_segment(segment).exists? || modular_jobs.with_segment(segment).exists? || 
      service_jobs.with_segment(segment).exists? || custom_jobs.with_segment(segment).exists? || 
      appliance_jobs.with_segment(segment).exists? || extra_jobs.with_segment(segment).exists? || 
      shangpin_jobs.with_segment(segment).exists?
  end

  # Whether this BOQ's line items for the given segment have been created, updated or deleted?
  # Big assumption for deleted items - we are only considering line items corresponding to the default classes for
  # segment. This is because this method was created for BOQ acceptance, which happens before the Production
  # drawing and splitting phase. Hence, it is not expected that a Boqjob will be tagged 'service', for example.
  # If you need tags as well, modify this or created a new method.
  # CustomElement can be of any segment, so they have to be treated separately.
  def line_items_changed_of_segment?(segment, start_time)
    change_flag = false
    SEGMENT_BOQ_LI_MAPPING[segment].each do |c_name|
      klass = c_name.constantize
      rel_name = c_name.underscore.pluralize
      # check for create and  update
      change_flag = self.public_send(rel_name).where("updated_at > ?", start_time).exists? || custom_jobs.with_segment(segment).where("custom_jobs.updated_at > ?", start_time).exists?
      # check for deleted - Too time-consuming query - skip for now
      break if change_flag
    end

    change_flag
  end
end

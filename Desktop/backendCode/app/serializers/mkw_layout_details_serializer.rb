class MkwLayoutDetailsSerializer < MkwLayoutSerializer
  attribute :modular_jobs
  attribute :appliance_jobs
  attribute :extra_jobs

  def modular_jobs
    object.modular_jobs.map { |modular_job|
      ModularJobSerializer.new(modular_job).serializable_hash
    }
  end

  def appliance_jobs
    object.appliance_jobs.map { |appliance_job|
      ApplianceJobSerializer.new(appliance_job).serializable_hash
    }
  end

  def extra_jobs
    object.extra_jobs.map { |extra_job|
      ExtraJobSerializer.new(extra_job).serializable_hash
    }
  end
end

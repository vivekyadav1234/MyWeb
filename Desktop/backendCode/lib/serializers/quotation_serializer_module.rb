module QuotationSerializerModule
  def boqjobs
    hash = Hash.new
    spaces = object_to_evaluate.boqjobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.boqjobs.where(space: space).map{ |boqjob|
        BoqjobSerializer.new(boqjob).serializable_hash
      }
    end
    hash
  end

  def service_jobs
    hash = Hash.new
    spaces = object_to_evaluate.service_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.service_jobs.where(space: space).map{ |service_job|
        ServiceJobSerializer.new(service_job).serializable_hash
      }
    end
    hash
  end

  def appliance_jobs
    hash = Hash.new
    spaces = object_to_evaluate.appliance_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.appliance_jobs.where(space: space).map{ |appliance_job|
        ApplianceJobSerializer.new(appliance_job).serializable_hash
      }
    end
    hash
  end

  def custom_jobs
    hash = Hash.new
    spaces = object_to_evaluate.custom_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.custom_jobs.where(space: space).map{ |custom_job|
        CustomJobSerializer.new(custom_job).serializable_hash
      }
    end
    hash
  end

  def extra_jobs
    hash = Hash.new
    spaces = object_to_evaluate.extra_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.extra_jobs.where(space: space).map{ |extra_job|
        ExtraJobSerializer.new(extra_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_cabinet
    hash = Hash.new
    spaces = object_to_evaluate.shangpin_jobs.cabinet_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.shangpin_jobs.cabinet_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_door
    hash = Hash.new
    spaces = object_to_evaluate.shangpin_jobs.door_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.shangpin_jobs.door_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_accessory
    hash = Hash.new
    spaces = object_to_evaluate.shangpin_jobs.accessory_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.shangpin_jobs.accessory_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_sliding_door
    hash = Hash.new
    spaces = object_to_evaluate.shangpin_jobs.sliding_door_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.shangpin_jobs.sliding_door_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_wardrobe
    hash = Hash.new
    spaces = object_to_evaluate.shangpin_jobs.wardrobe_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object_to_evaluate.shangpin_jobs.wardrobe_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job).serializable_hash
      }
    end
    hash
  end

  def modular_jobs_wardrobe
    hash = Hash.new
    space_array = object_to_evaluate.modular_jobs.where(category: "wardrobe").pluck(:space)
    space_array.each do |space|
      hash[space] = modular_jobs_by_space(space, "wardrobe")
    end

    hash
  end

  def modular_jobs_kitchen
    hash = Hash.new
    space_array = object_to_evaluate.modular_jobs.where(category: "kitchen").pluck(:space)
    space_array.each do |space|
      hash[space] = modular_jobs_by_space(space, "kitchen")
    end

    hash
  end

  # split into combined modules and ordinary modules.
  # modules that are part of a combined module must be within that combined module.
  def modular_jobs_by_space(space, category)
    jobs_to_consider = object_to_evaluate.modular_jobs.where(space: space, category: category)
    # independent modules first
    arr1 = jobs_to_consider.not_combined_module.where(combined_module_id: nil).map{ |modular_job|
        ModularJobSerializer.new(modular_job).serializable_hash
      }

    # now the combined modules and the modules within them
    arr2 = jobs_to_consider.where(combined: true).map{ |modular_job|
        ModularJobSerializer.new(modular_job).serializable_hash
      }

    arr1 + arr2
  end
end

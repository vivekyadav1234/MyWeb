# Here we are only going to render data that is needed by front-end. This needs to be done to reduce
# boq load time which is extremely high (can be 20s+).
class QuotationWithJobsSerializer < ActiveModel::Serializer
  attributes :id, :name, :terms, :net_amount, :total_amount, :status, :generation_date,:remark,
    :expiration_date, :expiration_in_days, :billing_address, :flat_amount, :customer_notes, :created_at,
    :updated_at, :reference_number, :project_id, :user_id, :designer_id, :spaces, :spaces_kitchen,
    :spaces_loose, :spaces_services, :spaces_custom, :spaces_custom_furniture, :countertop_cost, :paid_amount,
    :discount_value,:discount_status,:disc_status_updated_at,:disc_status_updated_by,:final_amount,:is_approved, :wip_status, :copied,
    :per_10_approved_by_id,:per_10_approved_at,:per_50_approved_by_id,:per_50_approved_at, :category_appoval_by_id, :category_appoval_at, :cm_approval, :category_approval, :per_100_true
  attribute :project_name
  attribute :boq_global_configs
  attribute :modular
  attributes :final_amount, :ten_per_true, :parent_quotation_id, :parent_quotation_reference_no, :per_50_true, :is_have_approved_payments
  attribute :last_payment_status
  attribute :balance_amount
  attribute :boqjobs
  attribute :service_jobs
  attribute :appliance_jobs
  attribute :modular_jobs_wardrobe
  attribute :modular_jobs_kitchen
  attribute :custom_jobs
  attribute :extra_jobs_wardrobe
  attribute :extra_jobs_kitchen
  attribute :shangpin_jobs_cabinet
  attribute :shangpin_jobs_door
  attribute :shangpin_jobs_accessory
  attribute :shangpin_jobs_wardrobe
  attribute :shangpin_jobs_sliding_door
  attribute :space_amounts_loose
  attribute :space_amounts_services
  attribute :space_amounts_kitchen
  attribute :space_amounts_wardrobe
  attribute :space_amounts_custom
  attribute :space_amounts_shangpin
  attribute :countertop_details
  attribute :cost_price_total
  attribute :countertop_details
  attribute :cost_price_total
  attribute :handover_present
  attribute :pm_fee

  def initialize(*args)
    super
    @discount_factor_to_use = object.discount_value_to_use.to_f/100.0
    @shangpin_effective_factor = object.shangpin_effective_factor
  end

  def pm_fee
    object.total_pm_fee.round(2)
  end

  def handover_present
    object.project_handovers.present? ? true : false
  end

  def balance_amount
    object.total_amount - object.paid_amount.to_f
  end

  def cost_price_total
    object.estimated_cogs
  end

  def project_name
    object.project.name
  end

  def boq_global_configs
    object.boq_global_configs.map { |boq_global_config|
      BoqGlobalConfigSerializer.new(boq_global_config).serializable_hash
    }
  end

  def modular
    object.modular_jobs.present?
  end

  # Code has changed since originally written.
  def final_amount
    object.total_amount
  end

  def ten_per_true
    object.paid_amount.to_f > (0.07*object.total_amount).to_f
  end

  def per_50_true
    object.paid_amount.to_f > (0.45*object.total_amount).to_f
  end

  def per_100_true
    object.paid_amount.to_f.round(2) >= object.total_amount.to_f.round(2)
  end

  def parent_quotation_reference_no
    object.parent_quotation&.reference_number
  end

  def last_payment_status
    (object.payments.present? && object.payments&.last&.is_approved == nil) ?  "pending" : object.payments&.last&.is_approved
  end

  def is_have_approved_payments
    (object.payments.present?) ? object.payments.pluck(:is_approved).include?(true) : "pending"
  end

  def cost_price_total
    object.estimated_cogs
  end

  def countertop_details
    boq_global_config = object.boq_global_configs.find_by(category: 'kitchen')
    countertop_width = boq_global_config&.countertop_width.to_i > 0 ? boq_global_config&.countertop_width : object.default_countertop_length
    {
     countertop: boq_global_config&.countertop,
     price: object.countertop_cost.to_f.round(2),
     countertop_width: countertop_width,
     lead_time: boq_global_config&.countertop_lead_time
    }
  end

  def custom_jobs
    hash = Hash.new
    spaces = object.custom_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.custom_jobs.where(space: space).map{ |custom_job|
        CustomJobSerializer.new(custom_job).serializable_hash
      }
    end
    hash
  end

  def boqjobs
    hash = Hash.new

    spaces = object.boqjobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.boqjobs.where(space: space).map{ |boqjob|
        BoqjobLineItemSerializer.new(boqjob).serializable_hash
      }
    end
    hash
  end

  def service_jobs
    hash = Hash.new
    spaces = object.service_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.service_jobs.where(space: space).map{ |service_job|
        ServiceJobLineItemSerializer.new(service_job).serializable_hash
      }
    end
    hash
  end

  def appliance_jobs
    hash = Hash.new
    spaces = object.appliance_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.appliance_jobs.where(space: space).map{ |appliance_job|
        ApplianceJobLineItemSerializer.new(appliance_job).serializable_hash
      }
    end
    hash
  end

  def extra_jobs_wardrobe
    hash = Hash.new
    spaces = object.extra_jobs.where(category: 'wardrobe').pluck(:space)
    spaces.each do |space|
      hash[space] = object.extra_jobs.where(category: 'wardrobe').where(space: space).map{ |extra_job|
        ExtraJobSerializer.new(extra_job).serializable_hash
      }
    end
    hash
  end

  def extra_jobs_kitchen
    hash = Hash.new
    spaces = object.extra_jobs.where(category: 'kitchen').pluck(:space)
    spaces.each do |space|
      hash[space] = object.extra_jobs.where(category: 'kitchen').where(space: space).map{ |extra_job|
        ExtraJobSerializer.new(extra_job).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_cabinet
    hash = Hash.new
    spaces = object.shangpin_jobs.cabinet_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.shangpin_jobs.cabinet_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job, shangpin_effective_factor: @shangpin_effective_factor).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_door
    hash = Hash.new
    spaces = object.shangpin_jobs.door_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.shangpin_jobs.door_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job, shangpin_effective_factor: @shangpin_effective_factor).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_accessory
    hash = Hash.new
    spaces = object.shangpin_jobs.accessory_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.shangpin_jobs.accessory_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job, shangpin_effective_factor: @shangpin_effective_factor).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_sliding_door
    hash = Hash.new
    spaces = object.shangpin_jobs.sliding_door_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.shangpin_jobs.sliding_door_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job, shangpin_effective_factor: @shangpin_effective_factor).serializable_hash
      }
    end
    hash
  end

  def shangpin_jobs_wardrobe
    hash = Hash.new
    spaces = object.shangpin_jobs.wardrobe_jobs.pluck(:space)
    spaces.each do |space|
      hash[space] = object.shangpin_jobs.wardrobe_jobs.where(space: space).map{ |shangpin_job|
        ShangpinJobSerializer.new(shangpin_job, shangpin_effective_factor: @shangpin_effective_factor).serializable_hash
      }
    end
    hash
  end

  def modular_jobs_wardrobe
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "wardrobe").pluck(:space)
    space_array.each do |space|
      hash[space] = modular_jobs_by_space(space, "wardrobe")
    end

    hash
  end

  def modular_jobs_kitchen
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "kitchen").pluck(:space)
    space_array.each do |space|
      hash[space] = modular_jobs_by_space(space, "kitchen")
    end
    hash
  end

  def space_amounts_loose
    hash = Hash.new
    all_jobs = object.boqjobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).sum(:amount).round(2)
    end

    hash
  end

  def space_amounts_services
    hash = Hash.new
    all_jobs = object.service_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).sum(:amount).round(2)
    end

    hash
  end

  def space_amounts_wardrobe
    hash = Hash.new
    space_array = ( object.modular_jobs.where(category: "wardrobe").pluck(:space) + 
      object.extra_jobs.where(category: 'wardrobe').pluck(:space) ).uniq

    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(combined_module_id: nil).where(category: "wardrobe", space: space).sum(:amount) + 
        object.extra_jobs.where(category: 'wardrobe', space: space).sum(:amount) ).round(2)
    end

    hash
  end

  def space_amounts_kitchen
    hash = Hash.new
    space_array = ( object.modular_jobs.where(category: "kitchen").pluck(:space) +
      object.appliance_jobs.pluck(:space) +
      object.extra_jobs.where(category: 'kitchen').pluck(:space) ).uniq

    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(category: "kitchen", space: space).sum(:amount) +
        object.appliance_jobs.where(space: space).sum(:amount) +
        object.extra_jobs.where(category: 'kitchen', space: space).sum(:amount) ).round(2)
    end

    hash
  end

  def space_amounts_custom
    hash = Hash.new
    all_jobs = object.custom_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).sum(:amount).round(2)
    end

    hash
  end

  def space_amounts_shangpin
    hash = Hash.new
    all_jobs = object.shangpin_jobs
    space_array = all_jobs.pluck(:space)
    effective_factor = object.shangpin_jobs.first&.effective_factor.to_f
    space_array.each do |space|
      amount = all_jobs.where(space: space).sum(:amount) * effective_factor
      hash[space] = amount.round(2)
    end

    hash
  end

  private
  def object_to_evaluate
    object
  end

  # split into combined modules and ordinary modules.
  # modules that are part of a combined module must be within that combined module.
  def modular_jobs_by_space(space, category)
    jobs_to_consider = object_to_evaluate.modular_jobs.where(space: space, category: category)
    # independent modules first
    arr1 = jobs_to_consider.not_combined_module.where(combined_module_id: nil).map{ |modular_job|
        ModularJobLineItemSerializer.new(modular_job).serializable_hash
      }

    # now the combined modules and the modules within them
    arr2 = jobs_to_consider.where(combined: true).map{ |modular_job|
        ModularJobLineItemSerializer.new(modular_job).serializable_hash
      }

    arr1 + arr2
  end
end

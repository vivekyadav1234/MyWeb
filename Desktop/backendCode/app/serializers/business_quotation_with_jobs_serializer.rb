class BusinessQuotationWithJobsSerializer < QuotationSerializer
  attribute :boqjobs
  attribute :service_jobs
  attribute :appliance_jobs
  attribute :modular_jobs_wardrobe
  attribute :modular_jobs_kitchen
  attribute :custom_jobs
  attribute :extra_jobs
  attribute :shangpin_jobs_cabinet
  attribute :shangpin_jobs_door
  attribute :shangpin_jobs_accessory
  attribute :shangpin_jobs_sliding_door
  attribute :shangpin_jobs_wardrobe
  attribute :space_amounts_loose
  attribute :space_amounts_services
  attribute :space_amounts_kitchen
  attribute :space_amounts_wardrobe
  attribute :space_amounts_custom
  attribute :countertop_details
  attributes :cost_price_loose, :cost_price_services, :cost_price_wardrobe, :cost_price_kitchen, :cost_price_custom, :cost_price_total, :margin_percentage, :margin_amount

  include QuotationSerializerModule

  def countertop_details
    boq_global_config = object.boq_global_configs.find_by(category: 'kitchen')
    countertop_width = boq_global_config&.countertop_width.to_i > 0 ? boq_global_config&.countertop_width : object.default_countertop_length
    {
     countertop: boq_global_config&.countertop,
     price: object.countertop_cost,
     countertop_width: countertop_width,
     lead_time: boq_global_config&.countertop_lead_time
    }
  end

  def space_amounts_loose
    hash = Hash.new
    all_jobs = object.boqjobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).pluck(:amount).map(&:to_f).sum.round(2)
    end
    hash
  end

  def cost_price_loose
    hash = Hash.new
    all_jobs = object.boqjobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).map(&:estimated_cogs).compact.sum.round(2)
    end
    hash
  end

  def space_amounts_services
    hash = Hash.new
    all_jobs = object.service_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).pluck(:amount).map(&:to_f).sum.round(2)
    end
    hash
  end

  def cost_price_services
    hash = Hash.new
    all_jobs = object.service_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).map(&:estimated_cogs).compact.sum.round(2)
    end
    hash
  end

  def space_amounts_wardrobe
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "wardrobe").pluck(:space)
    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(combined_module_id: nil).where(category: "wardrobe", space: space).sum(:amount) + 
        object.extra_jobs.where(category: "wardrobe", space: space).sum(:amount) ).round(2)
    end
    hash
  end

  def cost_price_wardrobe
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "wardrobe").pluck(:space)
    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(combined_module_id: nil).where(category: "wardrobe", space: space).map(&:estimated_cogs).compact.sum + 
        object.extra_jobs.where(category: 'wardrobe').map(&:estimated_cogs).compact.sum ).round(2)
    end
    hash
  end

  def space_amounts_kitchen
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "kitchen").pluck(:space)
    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(category: "kitchen", space: space).sum(:amount) +
        object.appliance_jobs.sum(:amount) + 
        object.extra_jobs.where(category: "kitchen", space: space).sum(:amount) ).round(2)
    end
    hash
  end

  def cost_price_kitchen
    hash = Hash.new
    space_array = object.modular_jobs.where(category: "kitchen").pluck(:space)
    space_array.each do |space|
      hash[space] = ( object.modular_jobs.where(category: "kitchen", space: space).map(&:estimated_cogs).compact.sum +
        object.appliance_jobs.map(&:estimated_cogs).compact.sum + 
        object.extra_jobs.where(category: 'kitchen').map(&:estimated_cogs).compact.sum ).round(2)
    end
    hash
  end

  def space_amounts_custom
    hash = Hash.new
    all_jobs = object.custom_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).pluck(:amount).map(&:to_f).sum.round(2)
    end
    hash
  end

  def cost_price_custom
    hash = Hash.new
    all_jobs = object.custom_jobs
    space_array = all_jobs.pluck(:space)
    space_array.each do |space|
      hash[space] = all_jobs.where(space: space).map(&:estimated_cogs).compact.sum.round(2)
    end
    hash
  end

  def cost_price_total
    object.estimated_cogs
  end

  def margin_percentage
    object.margin_percentage
  end

  def margin_amount
    object.margin_amount
  end

  private
  def object_to_evaluate
    object
  end
end

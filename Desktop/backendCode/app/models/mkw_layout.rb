# == Schema Information
#
# Table name: mkw_layouts
#
#  id            :integer          not null, primary key
#  category      :string
#  name          :string
#  remark        :text
#  global        :boolean          default(FALSE)
#  created_by_id :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class MkwLayout < ApplicationRecord
  belongs_to :created_by, class_name: 'User', required: true

  has_many :modular_jobs, as: :ownerable, dependent: :destroy
  has_many :appliance_jobs, as: :ownerable, dependent: :destroy
  has_many :extra_jobs, as: :ownerable, dependent: :destroy

  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  def export_to_quotation(quotation, category, space)
    ActiveRecord::Base.transaction do 
      quotation = export_modular_jobs(quotation, category, space)
      export_appliance_jobs(quotation, space)
      export_extra_jobs(quotation, space)
    end
    quotation.set_amounts
    quotation
  end

  # works in a pretty similar way to the import_modules_into_layout, but of course, somewhat
  # in reverse.
  def export_modular_jobs(quotation, category, space)
    top_level_jobs = modular_jobs.where(combined_module_id: nil)
    top_level_jobs.each do |layout_job|
      # initialize the job first
      # modular_job = quotation.modular_jobs.build
      modular_job = layout_job.import_job_from_layout(quotation, category, space)
      # byebug
      modular_job.skip_price_calculation = true
      modular_job.save!
      modular_job.copy_job_addons(layout_job)
      # initialize its modular_jobs next, if any (this deals with the combined module's modules)
      layout_job.modular_jobs.each do |included_layout_job|
        # included_modular_job = self.modular_jobs.build
        
        included_modular_job = included_layout_job.import_job_from_layout(quotation, category, space)
        included_modular_job.combined_module = modular_job
        # included_modular_job.ownerable = quotation
        # byebug
        included_modular_job.skip_price_calculation = true
        included_modular_job.save!
        included_modular_job.copy_job_addons(included_layout_job)
      end
    end

    quotation.save!
    quotation
  end

  # This method will import all the modules given into this mkw_layout. Uses the method import_job_for_layout
  # for each individual module.
  def import_modules_into_layout(modular_job_ids, options = {})
    all_modular_jobs = ModularJob.where(id: modular_job_ids)
    top_level_jobs = all_modular_jobs.where(combined_module_id: nil)
    top_level_jobs.each do |modular_job|
      # initialize the job first
      # layout_job = self.modular_jobs.build
      layout_job = modular_job.import_job_for_layout
      layout_job.ownerable = self
      # byebug
      layout_job.save!
      layout_job.copy_job_addons(modular_job)
      # initialize its modular_jobs next, if any (this deals with the combined module's modules)
      modular_job.modular_jobs.each do |included_modular_job|
        # included_layout_job = self.modular_jobs.build
        included_layout_job = included_modular_job.import_job_for_layout
        included_layout_job.combined_module = layout_job
        included_layout_job.ownerable = self
        # byebug
        included_layout_job.save!
        included_layout_job.copy_job_addons(included_modular_job)
      end
    end

    self
  end

  def import_appliances_into_layout(appliance_job_ids, options = {})
    ApplianceJob.where(id: appliance_job_ids).each do |appliance_job|
      layout_job = appliance_job.import_job_for_layout
      layout_job.ownerable = self
      layout_job.save!
    end
  end

  def import_extras_into_layout(extra_job_ids, options = {})
    ExtraJob.where(id: extra_job_ids).each do |extra_job|
      layout_job = extra_job.import_job_for_layout
      layout_job.ownerable = self
      layout_job.save!
    end
  end

  # export to quotation
  def export_appliance_jobs(quotation, space)
    appliance_jobs.each do |appliance_job|
      quotation_job = appliance_job.import_job_for_quotation(space)
      quotation_job.ownerable = quotation
      quotation_job.save!
    end
  end

  def export_extra_jobs(quotation, space)
    extra_jobs.each do |extra_job|
      quotation_job = extra_job.import_job_for_quotation(space)
      quotation_job.ownerable = quotation
      quotation_job.save!
    end
  end

  # This method will go through each of the modular_jobs of this layout and check if their addons are in order. Two checks:
  # :mandatory_addons_present?
  # :addons_must_be_mapped (make sure to not call it with the option to delete unmapped addons as we are only checking here).
  # ALL the modular_jobs must pass the checks for this method to return true!
  def addons_eligible_for_share?
    valid_flag = true

    modular_jobs.each do |modular_job|
      valid_flag = false unless ( modular_job.mandatory_addons_present? && !modular_job.has_unmapped_addons? )
      break unless valid_flag  #already a modular_job was found to have invalid/missing addons - no need to check further.
    end

    return valid_flag
  end
end

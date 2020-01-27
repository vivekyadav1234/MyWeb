# == Schema Information
#
# Table name: boq_labels
#
#  id             :integer          not null, primary key
#  label_name     :string           not null
#  quotation_id   :integer
#  ownerable_type :string
#  ownerable_id   :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class BoqLabel < ApplicationRecord
  has_paper_trail
  
  belongs_to :quotation, required: true
  belongs_to :ownerable, polymorphic: true, optional: true

  has_one :project, through: :quotation
  has_many :bom_sli_cutting_list_data, dependent: :destroy

  has_many :label_job_elements, dependent: :destroy
  has_many :job_elements, through: :label_job_elements

  before_validation :set_quotation
  after_save :ensure_label_name

  # Allow only alphanumeric character and underscore.
  validates_format_of :label_name, with: /\A[a-zA-Z0-9_]*\z/, message: "must contain only aplhabets, numbers and underscore"
  validates_uniqueness_of :label_name, allow_blank: true, if: :created_after_cutoff?
  validate :no_duplicate_labels, unless: :created_after_cutoff?

  # How many labels can be auto-generated at a time, when adding/editing a line item.
  MAX_AUTO_GENERATED_LABELS = 5
  UNIQUE_LABEL_CUTOFF_TIME = Date.parse('15-10-2019').beginning_of_day

  # setter methods modified to store '_' instead of '-' - this prevents issues with filter.
  def label_name=(value)
    self[:label_name] = value&.gsub('-', '_')
  end

  # new record will not have created_at value present before being saved to DB.
  def created_after_cutoff?
    new_record? || ( created_at.present? && created_at >= UNIQUE_LABEL_CUTOFF_TIME )
  end

  def set_quotation
    self.quotation = ownerable.ownerable
  end

  def ensure_label_name
    if label_name.blank?
      if new_record?
        # not saved yet, so label_name will be set when saved.
        populate_label
      else
        # already saved to db, so ensure that this label is saved.
        populate_label({save_now: true})
      end
    end
  end

  def populate_label(options={})
    self.label_name = generate_label
    self.save if options[:save_now]
  end

  def generate_label
    if id.present?
      get_prefix + "#{id}"
    else
      ""
    end
  end

  def get_prefix
    case ownerable_type
    when "Boqjob"
      return "LF_"
    when "ModularJob"
      if ownerable&.category == 'kitchen'
        return "MK_"
      elsif ownerable&.category == 'wardrobe'
        return "MW_"
      end
    when "CustomJob"
      return "CUS_"
    when "ApplianceJob"
      return "APL_"
    when "ExtraJob"
      return "EXT_"
    when "ShangpinJob"
      return "CUF_"
    else
      return ""
    end
  end

  private
  def no_duplicate_labels
    # if label created_at beforet he cutoff date, then do the old validation.
    # project = quotation.project
    excluded_quotations = ( [quotation.parent_quotation&.id] + quotation.child_quotations.pluck(:id) ).flatten.compact.uniq
    pre_existing = BoqLabel.joins(:quotation).
      where.not(quotations: { id: excluded_quotations }).
      where(quotations: { id: project.quotations }).
      where(label_name: label_name).present?
    errors.add(:label_name, " - No two line items for a lead can have the same label, except a parent or child BOQ line items.") if pre_existing.present?
  end
end

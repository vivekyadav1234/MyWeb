# == Schema Information
#
# Table name: job_addons
#
#  id                      :integer          not null, primary key
#  modular_job_id          :integer
#  addon_id                :integer
#  quantity                :integer
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  compulsory              :boolean          default(FALSE)
#  slot                    :string
#  brand_id                :integer
#  compulsory_job_addon_id :integer
#  addon_combination_id    :integer
#

class JobAddon < ApplicationRecord
  belongs_to :modular_job, required: true
  belongs_to :addon, optional: true
  belongs_to :addon_combination, optional: true
  belongs_to :brand, optional: true

  # addons for addons associations
  belongs_to :compulsory_job_addon, class_name: 'JobAddon', optional: true
  has_many :optional_job_addons, class_name: 'JobAddon', foreign_key: 'compulsory_job_addon_id', dependent: :destroy

  # validate :compulsory_job_addon_not_self
  validate :addon_required
  validates :quantity, numericality: { greater_than: 0 }

  LAYOUT_COLUMNS_TO_COPY = [:addon_id, :addon_combination_id, :quantity, :compulsory, :slot, :brand_id]

  def import_for_layout
    new_job_addon = self.deep_clone only: LAYOUT_COLUMNS_TO_COPY
    new_job_addon
  end

  def combination?
    addon_combination.present?
  end

  private
  # def compulsory_job_addon_not_self
  #   errors.add(:compulsory_job_addon_id, "an addon cannot have itself as its optional addon!") if self == compulsory_job_addon
  # end

  # must have either an addon or an addon_combination associated.
  def addon_required
    errors.add(:addon_id, "missing addon or addon combination - at least 1 is needed.") if addon.blank? && addon_combination.blank?
  end

end

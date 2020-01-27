# == Schema Information
#
# Table name: extra_jobs
#
#  id             :integer          not null, primary key
#  name           :string
#  rate           :float
#  quantity       :float
#  amount         :float
#  space          :string
#  vendor_sku     :string
#  specifications :string
#  ownerable_type :string
#  ownerable_id   :integer
#  addon_id       :integer
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  estimated_cogs :float            default(0.0)
#  clubbed_job_id :integer
#  tag_id         :integer
#  no_bom         :boolean          default(FALSE), not null
#

class ExtraJobSerializer < ActiveModel::Serializer
  attributes :id, :name, :rate, :quantity, :amount, :space, :vendor_sku, :ownerable_type, :ownerable_id,
    :addon_id, :created_at, :updated_at, :specifications, :addon_combination_id

  attribute :make
  attribute :image_url
  attribute :labels
  attribute :included_addons, if: :belongs_to_combination?

  def initialize(*args)
    super
    @addon = object.addon
    @addon_combination = object.addon_combination
  end

  # overriding
  def name
    if object.addon.present?
      object.addon&.name
    else
      object.addon_combination&.combo_name
    end
  end

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def make
    @addon&.brand&.name
  end

  def image_url
    @addon&.addon_image&.url
  end

  def included_addons
    addon_combination = object.addon_combination
    if addon_combination.present?
      addon_combination.addon_combination_mappings.map do |mapping|
        AddonSerializer.new(mapping.addon).serializable_hash.merge(quantity: mapping.quantity)
      end
    else
      []
    end
  end

  def belongs_to_combination?
    object.addon_combination.present?
  end
end


class BusinessExtraJobSerializer < ExtraJobSerializer
  attribute :cost_price

  def cost_price
    object.estimated_cogs
  end
end

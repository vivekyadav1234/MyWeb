# == Schema Information
#
# Table name: shangpin_jobs
#
#  id                       :integer          not null, primary key
#  space                    :string
#  cabinet_model_no         :string
#  cabinet_width            :integer
#  cabinet_depth            :integer
#  cabinet_height           :integer
#  cabinet_material         :string
#  cabinet_specific_door    :integer
#  cabinet_specific_worktop :integer
#  cabinet_specific_leg     :integer
#  cabinet_handle           :string
#  cabinet_price            :float            default(0.0)
#  cabinet_quantity         :float            default(0.0)
#  cabinet_amount           :float            default(0.0)
#  door_style_code          :string
#  door_width               :integer
#  door_depth               :integer
#  door_height              :integer
#  door_quantity            :float            default(0.0)
#  door_amount              :float            default(0.0)
#  accessory_code           :string
#  accessory_width          :integer
#  accessory_depth          :integer
#  accessory_height         :integer
#  accessory_price          :float            default(0.0)
#  accessory_quantity       :float            default(0.0)
#  accessory_amount         :float            default(0.0)
#  ownerable_type           :string
#  ownerable_id             :integer
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  job_type                 :string           not null
#  amount                   :float            default(0.0), not null
#  cabinet_item             :string
#  cabinet_color            :string
#  door_item                :string
#  door_color               :string
#  door_model_no            :string
#  accessory_item           :string
#  accessory_color          :string
#  accessory_model_no       :string
#  wardrobe_price           :float            default(0.0)
#  wardrobe_amount          :float            default(0.0)
#  door_price               :float            default(0.0)
#  tag_id                   :integer
#  clubbed_job_id           :integer
#  no_bom                   :boolean          default(FALSE), not null
#

class ShangpinJobSerializer < ActiveModel::Serializer
  attributes :id, :space, :cabinet_model_no, :cabinet_material, :cabinet_platform, :cabinet_door,:cabinet_handle, :cabinet_quantity, :cabinet_price, :cabinet_amount,
    :door_style_code, :door_quantity, :door_price, :door_amount, :accessory_model_no, :accessory_code, :accessory_quantity, :accessory_price, :accessory_amount, :cabinet_item, :cabinet_color, :door_item,
    :door_color, :door_model_no, :accessory_item, :accessory_color, :ownerable_type, :ownerable_id, :job_type,:wardrobe_price, :wardrobe_amount, :lead_time, :imported_file_type

  attribute :cabinet_price_factored
  attribute :cabinet_amount_factored
  attribute :door_amount_factored
  attribute :accessory_price_factored
  attribute :accessory_amount_factored
  attribute :cabinet_overall_size
  attribute :cabinet_specific_size
  attribute :door_overall_size
  attribute :door_specific_size
  attribute :accessory_overall_size
  attribute :accessory_specific_size
  attribute :door_price_factored
  attribute :wardrobe_price_factored
  attribute :wardrobe_amount_factored
  attribute :amount_factored
  attribute :labels
  attribute :door_handle
  attribute :door_material
  attribute :accessory_handle
  attribute :accessory_material
  attribute :image_url
  attribute :core_material
  def image_url
   object.image&.url == "/images/original/missing.png" || object.image_content_type == "image/wmf" ? nil : object.image&.url
  end

  def labels
    object.boq_labels.map do |boq_label|
      boq_label.attributes.slice('id', 'label_name', 'created_at', 'updated_at')
    end
  end

  def initialize(*args)
    super
    @shangpin_effective_factor = instance_options[:shangpin_effective_factor]
    #If no factor is passed in options, calculate - this will run around 3-4 DB queries, which is what we are trying to avoid. Not ideal, but better than failure.
    @shangpin_effective_factor ||= object.effective_factor
  end

  def core_material
    object.get_core_material     
  end

  def door_handle
    object.job_type == "door" ? object.job_handle : nil
  end

  def door_material
    object.job_type == "door" ? object.job_material : nil    
  end

  def accessory_handle
    object.job_type == "accessory" ? object.job_handle : nil
  end

  def accessory_material
    object.job_type == "accessory" ? object.job_material : nil    
  end  

  def amount_factored
    object.amount.to_f * @shangpin_effective_factor
  end

  def cabinet_price_factored
    object.cabinet_price.to_f * @shangpin_effective_factor
  end

  def cabinet_amount_factored
    object.cabinet_amount.to_f * @shangpin_effective_factor
  end

  def door_amount_factored
    object.door_amount.to_f * @shangpin_effective_factor
  end

  def accessory_price_factored
    object.accessory_price.to_f * @shangpin_effective_factor
  end

  def accessory_amount_factored
    object.accessory_amount.to_f * @shangpin_effective_factor
  end

  def door_price_factored
    object.door_price.to_f * @shangpin_effective_factor
  end

  def wardrobe_price_factored
    object.wardrobe_price.to_f * @shangpin_effective_factor
  end

  def wardrobe_amount_factored
    object.wardrobe_amount.to_f * @shangpin_effective_factor
  end

  def cabinet_overall_size
    [object.cabinet_width, object.cabinet_depth, object.cabinet_height].join("X")
  end

  def door_specific_size
    if ["door", "sliding_door"].include? object.job_type
       [object.job_spec_door, object.job_spec_worktop, object.job_spec_leg].join("X")
    else
      nil
    end
  end

  def accessory_specific_size
    if object.job_type == "accessory"
       [object.job_spec_door, object.job_spec_worktop, object.job_spec_leg].join("X")
    else
      nil
    end
  end

  def cabinet_specific_size
    [object.cabinet_specific_door, object.cabinet_specific_worktop, object.cabinet_specific_leg].join("X")
  end

  def door_overall_size
    [object.door_width, object.door_depth, object.door_height].join("X")
  end

  def accessory_overall_size
    [object.accessory_width, object.accessory_depth, object.accessory_height].join("X")
  end
end

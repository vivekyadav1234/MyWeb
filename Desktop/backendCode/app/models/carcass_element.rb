# == Schema Information
#
# Table name: carcass_elements
#
#  id                      :integer          not null, primary key
#  code                    :string
#  width                   :integer
#  depth                   :integer
#  height                  :integer
#  length                  :float
#  breadth                 :float
#  thickness               :float
#  edge_band_thickness     :integer
#  area_sqft               :float
#  category                :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  carcass_element_type_id :integer
#

class CarcassElement < ApplicationRecord
  has_paper_trail

  belongs_to :carcass_element_type, required: true

  has_many :module_carcass_elements, dependent: :destroy
  has_many :product_modules, through: :module_carcass_elements

  validates_presence_of :code
  validates_uniqueness_of :code, scope: [:category]
  
  ALLOWED_CATEGORIES = ['wardrobe', 'kitchen']
  validates_inclusion_of :category, in: ALLOWED_CATEGORIES

  scope :kitchen, -> {where(category: "kitchen")}
  scope :wardrobe, -> {where(category: "wardrobe")}

  def CarcassElement.finish_factor(category, price_factor_hash)
    price_factor_hash["sale_cost_factor"][category]["finishes"]["default"]
  end

  def CarcassElement.movement_factor(category, price_factor_hash, shade_code=nil)
    Shade.custom_shade_code?(shade_code) ? price_factor_hash["sale_cost_factor"][category]["finishes"]["non_fast_moving_modifier"] : MKW_GLOBAL_DATA["sale_cost_factor"][category]["finishes"]["fast_moving_modifier"]
  end

  def core_material_cost(core_material, category, options = {})
    if carcass_element_type.glass
      glass_price = MKW_GLOBAL_DATA["glass_prices"][thickness]
      return area_sqft * glass_price
    elsif carcass_element_type.aluminium
      aluminium_price = MKW_GLOBAL_DATA["aluminium_prices"]["default"]
      # price is per running metre while perimeter is mm
      # qty changed to sqft as per new rate by Abhishek
      return area_sqft * aluminium_price
    else
      # core_material_price = CoreMaterial.find_by(name: core_material).core_material_prices.find_by(category: category, thickness: thickness).price
      core_material_price = CoreMaterial.core_material_price(core_material, category, thickness)
      if options[:area_only]
        return area_sqft * get_modifier(options)  #This takes care of the 18% case.
      else
        return area_sqft * core_material_price * get_modifier(options)
      end
    end
  end

  def shutter_finish_cost(shutter_finish_price)
     area_sqft * shutter_finish_price
  end

  def exposed_side_finish_cost(shutter_finish_price, number_exposed_sites)
    area_sqft * number_exposed_sites.to_i * shutter_finish_price
  end

  def edge_band_cost
    edge_band_price = edge_band_thickness.to_f > 0 ? ProductModule::EDGE_BAND_PRICE_HASH[edge_band_thickness] : 0
    perimeter/304.8 * edge_band_price
  end

  def perimeter
    2 * (length + breadth)
  end

  # This method will return the modifier for calculating the core material cost of a carcass
  # element. Ordinarily, it should be based solely on the carcass element, but including
  # options just in case of future need for considering module/customization etc.
  # It would be faster to collect these modifiers in the product_module's :calculate_price 
  # method. But it would make the model more complicated to understand and change.
  def get_modifier(options={})
    modifier = 1.0
    module_to_check = options[:product_module]
    if options[:civil_kitchen] && module_to_check.percent_18_reduction && CarcassElementType::PERCENT_18_REDUCTION.include?(carcass_element_type.name) && module_to_check.module_type.kitchen_categories.include?(KitchenCategory.base_unit)
      modifier = 0.18
    end

    modifier
  end
end

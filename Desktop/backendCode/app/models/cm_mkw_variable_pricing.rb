# == Schema Information
#
# Table name: cm_mkw_variable_pricings
#
#  id                :integer          not null, primary key
#  full_home_factors :json             not null
#  mkw_factors       :json             not null
#  cm_id             :integer
#

class CmMkwVariablePricing < ApplicationRecord
  has_paper_trail
  
  belongs_to :cm, class_name: 'User', required: true

  validate :cm_role_check, on: :create
  validate :validate_margin_hashes

  # return the required json data as a hash.
  def self.pricing_data(cm_id, category)
    cm_user = User.find cm_id
    record = cm_user.cm_mkw_variable_pricing
    if record.present && category == 'wardrobe'
      record.wardrobe_prices
    elsif record.present && category == 'kitchen'
      record.kitchen_prices
    else
      nil
    end
  end

  private
  def cm_role_check
    errors.add(:cm_id, 'must have role Community Manager') unless cm.has_role?(:community_manager)
  end

  def validate_margin_hashes
    errors.add(:full_home_factors, 'invalid file - please ensure that all the required factors are present.') if full_home_factors.present? && !all_factors_present(full_home_factors)
    errors.add(:mkw_factors, 'invalid file - please ensure that all the required factors are present.') if mkw_factors.present? && !all_factors_present(mkw_factors)
  end

  def all_factors_present(pricing_hash)
    sale_cost_factor_hash = pricing_hash["sale_cost_factor"]
    # check common factors
    return false unless sale_cost_factor_hash.present? && sale_cost_factor_hash["loose_furniture"].present? && sale_cost_factor_hash["loose_furniture"].present? && 
      sale_cost_factor_hash["custom_sku"].present? && sale_cost_factor_hash["services_base"].present? && sale_cost_factor_hash["services_installation"].present?

    # check for wardrobe factors
    wardrobe_factor_hash = sale_cost_factor_hash["wardrobe"]
    return false unless wardrobe_factor_hash.present? && 
      wardrobe_factor_hash["carcass_elements"].present? && 
      wardrobe_factor_hash["hardware_elements"].present? && 
      wardrobe_factor_hash["finishes"].present? && wardrobe_factor_hash.dig("finishes", "default").present? && wardrobe_factor_hash.dig("finishes", "fast_moving_modifier").present? && wardrobe_factor_hash.dig("finishes", "non_fast_moving_modifier").present? && 
      wardrobe_factor_hash["edge_banding"].present? && 
      wardrobe_factor_hash["handles"].present? && 
      wardrobe_factor_hash["extras"].present? &&
      wardrobe_factor_hash["addons"].present? && wardrobe_factor_hash.dig("addons", "default").present? && wardrobe_factor_hash.dig("addons", "economy").present? && wardrobe_factor_hash.dig("addons", "standard").present? && wardrobe_factor_hash.dig("addons", "premium").present?
  
    # check for kitchen factors
    kitchen_factor_hash = sale_cost_factor_hash["kitchen"]
    return false unless kitchen_factor_hash.present? && 
      kitchen_factor_hash["carcass_elements"].present? && 
      kitchen_factor_hash["hardware_elements"].present? && 
      kitchen_factor_hash["finishes"].present? && kitchen_factor_hash.dig("finishes", "default").present? && kitchen_factor_hash.dig("finishes", "fast_moving_modifier").present? && kitchen_factor_hash.dig("finishes", "non_fast_moving_modifier").present? && 
      kitchen_factor_hash["edge_banding"].present? && 
      kitchen_factor_hash["handles"].present? && 
      kitchen_factor_hash["addons"].present? && kitchen_factor_hash.dig("addons", "default").present? && kitchen_factor_hash.dig("addons", "economy").present? && kitchen_factor_hash.dig("addons", "standard").present? && kitchen_factor_hash.dig("addons", "premium").present? && 
      kitchen_factor_hash["skirting"].present? && 
      kitchen_factor_hash["extras"].present? && 
      kitchen_factor_hash["appliances"].present? && 
      kitchen_factor_hash["countertop"].present?

    # Check for Shangpin factors
    return false unless sale_cost_factor_hash["shangpin"].present? && 
      sale_cost_factor_hash.dig("shangpin", "factor1").present? && 
      sale_cost_factor_hash.dig("shangpin", "factor2").present?

    return true
  end
end

# This is a PORO - Plain Old Ruby Class.
class SmartBoqGenerator
  # In the initializer, take input of:
  # 1. quotation_id
  # 2. Array of hashes, each hash being of form {section_id: 3, quantity: 2}
  # 3. target_price
  # NOTE: category and section are the same thing.
  def initialize(quotation_id, category_array, target_price)
    @quotation = Quotation.find quotation_id
    # @category_array = category_array
    @target_price = target_price
    @category_price_array = Section.category_price_array(category_array)
    @factor = get_factor
    @minimum_possible_price = min_possible_price
  end

  def populate_boq(space)
    return "No category was given or quantity was 0." unless categories_present?
    if price_possible?    
      @category_price_array.each do |hash|
        section = Section.find hash[:section_id]
        search_price = hash[:average_price] * @factor
        product = section.products.with_nearest_price(search_price)
        boqjob = @quotation.boqjobs.where(product: product, space: space).first_or_initialize
        # IF this product is not in BOQ, proceed normally.
        # ELSE find the boqjob and increment its quantity.
        # DO NOT create another job with the same product_id - that is allowed for modular_job
        # will not work for boqjob.
        if boqjob.new_record?
          boqjob.import_product(product, hash[:quantity], space)
        else
          quantity = boqjob.quantity + hash[:quantity]
          boqjob.import_product(product, quantity, space, save_now: true)
        end
      end
      if @quotation.save
        return @quotation
      else
        return @quotation.errors.full_messages
      end
    else
      return "No such BOQ is possible. The minimum target price possible for the given categories and their quantities is #{@minimum_possible_price}."
    end
  end

  private
  def get_factor
    sum_average_price = @category_price_array.map{|hash| hash[:average_price] * hash[:quantity]}.sum
    if sum_average_price == 0
      return 0.0
    else
      return @target_price/sum_average_price
    end
  end

  # check if the given price is possible, given the categories, their quantities and avg price.
  def price_possible?
    @minimum_possible_price <= @target_price
  end

  # check if at least one category is given
  def categories_present?
    @category_price_array.present?
  end

  def min_possible_price
    @category_price_array.map{|hash| hash[:minimum_price] * hash[:quantity]}.sum
  end
end
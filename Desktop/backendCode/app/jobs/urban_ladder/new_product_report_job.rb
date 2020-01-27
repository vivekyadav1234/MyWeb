# This will compile an email with list of new Urban Ladder imported products
class UrbanLadder::NewProductReportJob < ApplicationJob
  queue_as :urban_ladder

  # options - pass :raise_exception as true if on failure, you wish to raise exception instead of
  # mail generation.
  def perform(options={})
    ul_products = Product.urban_ladder
    new_products = ul_products.where("created_at > ?", 6.9.days.ago)
    data_hash = {
      new_products: new_products.pluck(:id),
      products_without_segment: ul_products.left_outer_joins(:catalog_segments).where(catalog_segments: { id: nil }).pluck(:id).uniq,
      products_without_category: ul_products.left_outer_joins(:catalog_categories).where(catalog_categories: { id: nil }).pluck(:id).uniq,
      products_without_subcategory: ul_products.left_outer_joins(:catalog_subcategories).where(catalog_subcategories: { id: nil }).pluck(:id).uniq,
      products_without_class: ul_products.left_outer_joins(:catalog_classes).where(catalog_classes: { id: nil }).pluck(:id).uniq
    }
    UrbanLadderMailer.new_product_report_success(data_hash).deliver!
    rescue StandardError => e 
      if options[:raise_exception]
        raise e
      else
        UrbanLadderMailer.new_product_report_failed.deliver!
      end
  end
end

class UrbanLadderMailer < ApplicationMailer
  default from: 'wecare@arrivae.com'

  def taxons_imported_mail(taxon_ids_success, taxon_ids_failed)
    @taxon_ids_success = taxon_ids_success
    @taxon_ids_failed = taxon_ids_failed
    mail(to: 'arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder taxons queued for import.")
  end

  def import_report_failed
    mail(to: 'arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder import report generation failed.")
  end

  def import_report_success(data_hash)
    @data_hash = data_hash
    mail(to: 'arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder import report.")
  end

  def new_product_report_success(data_hash)
    @new_products = Product.where(id: data_hash[:new_products]).pluck(:unique_sku)
    @products_without_segment = Product.where(id: data_hash[:products_without_segment]).pluck(:unique_sku)
    @products_without_category = Product.where(id: data_hash[:products_without_category]).pluck(:unique_sku)
    @products_without_subcategory = Product.where(id: data_hash[:products_without_subcategory]).pluck(:unique_sku)
    @products_without_class = Product.where(id: data_hash[:products_without_class]).pluck(:unique_sku)
    mail(to: 'tech@arrivae.com, arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder new product report.")
  end

  def new_product_report_failed
    mail(to: 'arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder new product report generation failed.")
  end

  def missing_skus(data_array)
    @data_array = data_array
    mail(to: 'arunoday@gloify.com, shobhit@gloify.com', 
         subject: "Urban Ladder missing skus.")
  end
end

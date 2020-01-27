# For the given taxon ids (if not given, take the hardcoded values).
class UrbanLadder::TaxonImportJob < ApplicationJob
  queue_as :urban_ladder

  def perform(ids_given = nil)
    taxon_ids_for_import = ids_given || UrbanLadderModule::TaxonomyImport.taxons_for_import
    taxon_ids_failed = []
    taxon_ids_for_import.each do |taxon_id|
      begin
        return_value = UrbanLadderModule::ProductImportModule.import_products(taxon_id)
        taxon_ids_failed << taxon_id unless return_value
      rescue
        taxon_ids_failed << taxon_id
        next
      end
    end
    
    taxon_ids_success = taxon_ids_for_import - taxon_ids_failed
    UrbanLadderMailer.taxons_imported_mail(taxon_ids_success, taxon_ids_failed).deliver!
  end
end

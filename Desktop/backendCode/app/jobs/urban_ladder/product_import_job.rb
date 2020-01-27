class UrbanLadder::ProductImportJob < ApplicationJob
  queue_as :urban_ladder

  def perform(product_id)
    UrbanLadderModule::ProductImportModule.import_product(product_id)
    urban_ladder_queue = UrbanLadderQueue.find_by(product_id: product_id)
    urban_ladder_queue.update!(status: 'success') if urban_ladder_queue.present?
  end
end

# This will compile an email with status of Urban Ladder imports.
class UrbanLadder::ImportReportJob < ApplicationJob
  queue_as :urban_ladder

  # options - pass :raise_exception as true if on failure, you wish to raise exception instead of
  # mail generation.
  def perform(options={})
    ul_queues = UrbanLadderQueue.all
    ul_jobs = Delayed::Job.where(queue: 'urban_ladder')
    ul_queue_success = UrbanLadderQueue.where(status: 'success')
    ul_queue_pending = UrbanLadderQueue.where(status: 'pending')
    ul_jobs_failed = Delayed::Job.where(queue: 'urban_ladder').where(attempts: Delayed::Worker.max_attempts)
    pending_product_ids = UrbanLadderQueue.where(job_id: ul_queue_pending.pluck(:job_id)).pluck(:product_id)
    failed_product_ids = UrbanLadderQueue.where(job_id: ul_jobs_failed.pluck(:id)).pluck(:product_id)
    data_hash = {
      ul_queues: ul_queues,
      ul_jobs: ul_jobs,
      ul_queue_success: ul_queue_success,
      ul_queue_pending: ul_queue_pending,
      ul_jobs_failed: ul_jobs_failed,
      pending_product_ids: pending_product_ids.uniq,
      failed_product_ids: failed_product_ids.uniq
    }
    UrbanLadderMailer.import_report_success(data_hash).deliver!
    rescue StandardError => e 
      if options[:raise_exception]
        raise e
      else
        UrbanLadderMailer.import_report_failed.deliver!
      end
  end
end

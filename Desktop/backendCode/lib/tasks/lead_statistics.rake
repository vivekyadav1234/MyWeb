namespace :lead_statistics do
  task populate_data: :environment do
    Lead.find_in_batches(batch_size: 1000).with_index do  |leads, i|
        LeadStatisticsJob.perform_later(leads.pluck(:id))
    end
  end
end

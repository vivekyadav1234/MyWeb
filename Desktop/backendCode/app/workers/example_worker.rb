# class ExampleWorker
#   include Sidekiq::Worker
#   sidekiq_options queue: "high"
#   # sidekiq_options retry: false
  
#   def perform(snippet_id)
#     # perform some action
#   end
# end
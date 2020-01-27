# Import data sent by FB webhook ping.
# Sample input expected format:
# {"object"=>"page", "entry"=>[{"id"=>"1947981418749602", "time"=>1569566950, 
# "changes"=>[{"value"=>{"ad_id"=>"23842689699100687", "form_id"=>"872906979555833", "leadgen_id"=>"1341738219339371", "created_time"=>1569566950, "page_id"=>"1947981418749602", "adgroup_id"=>"23842689699100687"}, "field"=>"leadgen"}]}], 
# "controller"=>"api/v1/fb_webhooks", "action"=>"process_payload", 
# "fb_webhook"=>{"object"=>"page", "entry"=>[{"id"=>"1947981418749602", "time"=>1569566950, 
# "changes"=>[{"value"=>{"ad_id"=>"23842689699100687", "form_id"=>"872906979555833", "leadgen_id"=>"1341738219339371", "created_time"=>1569566950, "page_id"=>"1947981418749602", "adgroup_id"=>"23842689699100687"}, "field"=>"leadgen"}]}]}}
class FbModule::WebhookImport
  include FbModule::WebhookProcessingModule

  def initialize(rbody)
    @params = rbody.with_indifferent_access
    @lead_source = LeadSource.where(name: "digital_marketing").first_or_create
    @lead_type = LeadType.find_by(name: 'customer')
    @errors = []
  end

  def import_lead
    process_page_data(@params)
  end
end

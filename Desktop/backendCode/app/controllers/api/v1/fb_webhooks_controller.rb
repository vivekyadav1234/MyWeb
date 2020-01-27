# This controller will provide calback urls which the FB will ping.
class Api::V1::FbWebhooksController < Api::V1::ApiController
  VERIFY_TOKEN = "MyH5XUsWe2LvRtMJDdzz"
  SHA1_TO_VERIFY = "the-acutal-sha1-goes-here"

  skip_before_action :authenticate_user!
  # before_action :verify_sha

  def verification
    # byebug
    puts request.url
    puts "hub.mode => #{params['hub.mode']}"
    puts "hub.challenge => #{params['hub.challenge']}"
    puts "hub.verify_token => #{params['hub.verify_token']}"
    FbMailer.fb_lead_test({rbody: params, message: "FB successfully pinged our api callback url for verification!"}).deliver!

    render json: "#{params['hub.challenge']}"
  end

  def process_payload
    FbModule::WebhookImport.new(params).import_lead
    # FbMailer.fb_lead_test({rbody: params, message: "FB delivered events payload to our api callback url!"}).deliver!
  
    render json: "#{params['hub.challenge']}"
  end

  private
  # Verify both hub.verify_token AND sha1
  # def verify_sha
  #   # unless request.headers['X-Hub-Signature'] == SHA1_TO_VERIFY
  #   #   return render json: {message: "SHA1 validation failed, aborting."}, status: 403
  #   # end
  #   unless params['hub.verify_token'] == VERIFY_TOKEN
  #     return render json: {message: "verify_token validation failed, aborting."}, status: 403
  #   end
  # end
end

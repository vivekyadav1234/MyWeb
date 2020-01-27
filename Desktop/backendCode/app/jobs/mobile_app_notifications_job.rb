class MobileAppNotificationsJob < ApplicationJob
  queue_as :default

  def perform(email,notificationHash,toScreen)
    # require "google/cloud/firestore"

    unless Rpush::App.find_by_name("arrivae_lead_app").present?
      app = Rpush::Gcm::App.new
      app.name = "arrivae_lead_app"
      app.auth_key = "AAAA8hzbv8w:APA91bHoLiN2V5AETINZHPCthJ-EuXtWmqdWZf-SHwPbJ96aYIR3x-faY1wHexUtrW-zdSqOv2X6ud9vA1YYWY0WM-NtimGVRFtD_9rqk11uNacZjCYfVQR772YfJRJI9e0x4dQd6eus"
      app.connections = 1
      app.save!
    end

    collectionSet = Rails.env.production? ? "users" : "dev_users"

    firestore = Google::Cloud::Firestore.new
    # Get a document reference
    user_ref = firestore.doc "#{collectionSet}/#{email}"
    user_snap = user_ref.get
    # get tokens from email reference
    tokens_array = user_snap[:token] rescue []

    # create notification
    if tokens_array.size != 0   
      n = Rpush::Gcm::Notification.new
      n.app = Rpush::Gcm::App.find_by_name("arrivae_lead_app")
      n.registration_ids = tokens_array
      n.data = { toScreen: toScreen }
      n.priority = 'high'        # Optional, can be either 'normal' or 'high'
      n.content_available = true # Optional
      # Optional notification payload. See the reference below for more keys you can use!
      n.notification = notificationHash
      n.save!
      Rpush.push
    end

    puts "notificatrin done"

  end

end

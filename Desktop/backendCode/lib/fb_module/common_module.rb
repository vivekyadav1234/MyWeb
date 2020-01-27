module FbModule::CommonModule
  require 'net/http'
  require 'uri'

  # Keeping this high to ensure that the number of api calls is reduced. We will instead get more 500 results per call.
  # By default, FB will send 25 results per page, which is NOT what we need.
  API_BASE_URL = "https://graph.facebook.com"
  API_VERSION = 4.0
  APP_ID = "219465398794374"
  APP_SECRET = "cf850445467c39092da01829187fea00"
  # This must be a long-lived access token, otherwise we will need to update it every time it expires.
  # Please check:
  # https://developers.facebook.com/docs/pages/access-tokens
  PERMANENT_TOKEN = "EAADHmkUiuIYBAKIuJGJw6IEHS7eoMgW1ZCLA7oe44oogsdtoTMx996w8jTlroErlLqQGPjHGtCqnfgnSIupRlUyZA0ItY6gLcJIWyHjjABwXaESILeO1klZAIClfBpjU9rLB3IMeNNvIZCxKt1Kl2zlyUnTGBnZB7iFhSDcH7oQZDZD"
  ACCESS_TOKEN = "EAADHmkUiuIYBAFYXpunXVZC2ZAEMAb9NlX9mDvh3AU3LSwBJKtnmTo0tGg77KTgo7qMOULQ7DXX8TacsZCdrcMHz4NE7Rxx48YAcYtcZA1xw3UHcX5aR2RSH7BmjnR62ECXugNHe2FKhA1vbYCK3j5pDp76Lx3KsO8CM7RB1ZBnapRV1yctwD"
  # This is the page 'Arrivae' - all leadgen forms are for this page only. If forms are created for any other page, then those pages
  # will also need to subscribe to the Arrivae fb app or their leads will not be pushed to our webhook.
  PAGE_ID = "1947981418749602"
  # This access token is valid for the access token above for the app for which it was generated. It will be needed if you wish to
  # subscribe to the page again for some reason.
  PAGE_ACCESS_TOKEN = "EAADHmkUiuIYBAF7dX04VjuadzjCmFtYowF7qaLnBz5ZCWOuUDNrMdbiUrYqYat1FJkB0vtMQm7GcD207z7WGTR1siJVA9L1UT1gRIc2GuF9Y9zjcs5SSnSAFJlZAZCZAgtw9mZBZA3s1TcSZCiyPbar1O1ZAKLSjDFMdZCc7eyjb8KoZCMRDdMYs3L8xo9Rpa7XCxCSqzVCSOUUtuaY6P5qvPhvbteeZCzD7boZD"
  LIMIT_PER_PAGE = 500

  def api_call(url, http_method = "get")
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    if http_method == 'get'
      request = Net::HTTP::Get.new(uri)
    elsif http_method == 'post'
      request = Net::HTTP::Post.new(uri)
    else
      puts "Please add functionality for http_method #{http_method}."
      return false
    end
    request["content-type"] = 'application/json'
    response = http.request(request)
  end

  # leadgen forms to skip. Used hash here instead of just an array of form ids so that we can have its name here
  # as well for easier understanding and debugging.
  def forms_to_skip
    {
      "Polka_Mumbai_SingleOptin": 959637067709656,
      "Polka_Mumbai_DoubleOptin": 474927669954304
    }
  end
end

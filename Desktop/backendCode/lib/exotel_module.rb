module ExotelModule
  require 'net/http'
  require 'uri'

  def self.call(from,to)

    uri = URI.parse("https://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Calls/connect.json")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"
    request.set_form_data(
      "From" => "8088791808",
      "To" => "9606627508",
      "CallerId" => "01139587632"
    )

    req_options = {
      use_ssl: uri.scheme == "https"
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    return {"code" => "#{response.code}", "body" => "#{response.body}"}

  end
end

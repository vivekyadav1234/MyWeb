class Exotel
  require 'net/http'
  require 'uri'

  def initialize
      # @config = YAML::load_file "#{Rails.root}/app/data/price.yml"
  end

  def call(from,to)
    puts "==============="
    puts "from #{from}"
    puts "to #{to}"
    uri = URI.parse("https://arrivae1:3447cf5296cd5c0485a114ecf8712f1324f66395@api.exotel.com/v1/Accounts/arrivae1/Calls/connect.json")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth "arrivae1", "3447cf5296cd5c0485a114ecf8712f1324f66395"
    request.set_form_data(
      "From" => from,
      "To" => to,
      "CallerId" => "08033947433"
    )

    req_options = {
      use_ssl: uri.scheme == "https"
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    return {"code" => "#{response.code}", "body" => "#{response.body}"}

  end

  def method_missing(name, *args, &block)
    @config[name.to_s]
  end
end

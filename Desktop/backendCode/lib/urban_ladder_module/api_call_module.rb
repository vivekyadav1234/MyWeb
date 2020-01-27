module UrbanLadderModule::ApiCallModule
  require 'net/http'
  require 'uri'

  BASE_URL = 'https://www.urbanladder.com/api'
  ACCESS_TOKEN = '9791d212024a2c8411243f5a09ba666c956118e6c322ca6a'

  # API to list taxons (hierarchy)
  def self.taxonomy_list_url
    url = BASE_URL + "/taxonomies/2/taxons?token=#{ACCESS_TOKEN}&taxonomy_v=2"
    puts url
    url
  end

  # API to list all variants for a taxon
  def self.taxon_variant_url(taxon_id, page)
    url = BASE_URL + "/variants?token=#{ACCESS_TOKEN}&q[product_taxons_id_eq]=#{taxon_id}&taxonomy_v=2&page=#{page}"
    puts url
    url
  end

  # API to list all details for a product
  def self.product_url(product_id)
    url = BASE_URL + "/products/#{product_id}?token=#{ACCESS_TOKEN}&taxonomy_v=2&version=1.1"
    puts url
    url
  end

  def self.api_call(url)
    uri = URI.parse(url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    # http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new(uri)
    request["content-type"] = 'application/json'
    response = http.request(request)
  end
end

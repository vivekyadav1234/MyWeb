class Price
  def initialize
      @config = YAML::load_file "#{Rails.root}/app/data/price.yml"
  end

  def method_missing(name, *args, &block)
    @config[name.to_s]
  end
end

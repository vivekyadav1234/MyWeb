class Swagger::Docs::Config
  def self.transform_path(path, api_version)
    # Make a distinction between the APIs and API documentation paths.
    "swagapidocs/#{path}"
  end
  def self.base_api_controller; ApplicationController end
  def self.base_application; [Rails.application] end
end

Swagger::Docs::Config.register_apis({
  '1.0' => {
    controller_base_path: '',
    api_file_path: 'public/swagapidocs',
    base_path: 'http://localhost:3000',
    clean_directory: true
  }
})

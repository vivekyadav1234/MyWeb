require "#{Rails.root.join('app','serializers','modular_job_serializer')}"

class MkwLayoutJobCustomizationSerializer < ModuleCustomizationSerializer
  # override original method they are not needed in a layout's customization info
  def allowed_addons
    []
  end

  def allowed_number_exposed_sites
    []
  end
end

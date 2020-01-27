class ProjectFileSerializer < ActiveModel::Serializer
end

class ThreeDImageSerializer < ActiveModel::Serializer
  attributes :name, :project_id, :three_d_image_url

  def three_d_image_url
    object.content&.document&.url
  end
end


class ReferenceImageSerializer < ActiveModel::Serializer
  attributes :name, :project_id, :reference_image_url

  def reference_image_url
    object.content&.document&.url
  end
end

class ElevationSerializer < ActiveModel::Serializer
  attributes :name, :project_id, :elevation_url

  def elevation_url
    object.content&.document&.url
  end
end


class CustomerInspirationSerializer < ActiveModel::Serializer
  attributes :name, :file_url, :uploaded_on

  def file_url
    object&.content&.document&.url
  end

  def uploaded_on
    object.created_at
  end

end


class LineMarkingSerializer < ActiveModel::Serializer
  attributes :name, :project_id, :line_marking_url, :description, :id

  def line_marking_url
    object.content&.document&.url
  end
end

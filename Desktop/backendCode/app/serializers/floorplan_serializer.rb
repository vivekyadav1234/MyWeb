# == Schema Information
#
# Table name: floorplans
#
#  id                           :integer          not null, primary key
#  name                         :string
#  project_id                   :integer
#  url                          :string
#  details                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#

class FloorplanSerializer < ActiveModel::Serializer
  attributes :id, :url, :name, :details,:attachment_file, :attachment_file_content_type, :created_at, :updated_at

  def designs
    current_user = @instance_options[:user]
    ability = Ability.new(current_user)
    if current_user.has_role? :designer
      object.designs.where(designer_id: current_user.id).map{ |design|
          DesignSerializer.new(design).serializable_hash
      }
    elsif ability.can? :read, Design && !current_user.has_role?(:community_manager)
      object.designs.map{ |design|
          DesignSerializer.new(design).serializable_hash
      }
    end
  end
end

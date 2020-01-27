# == Schema Information
#
# Table name: custom_elements
#
#  id                 :integer          not null, primary key
#  project_id         :integer
#  name               :string
#  dimension          :string
#  core_material      :string
#  shutter_finish     :string
#  designer_remark    :text
#  photo_file_name    :string
#  photo_content_type :string
#  photo_file_size    :integer
#  photo_updated_at   :datetime
#  ask_price          :float
#  price              :float
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  category_remark    :text
#  status             :string           default("pending")
#  seen_by_category   :boolean          default(FALSE)
#  asked_timeline     :integer          default(0)
#  timeline           :integer          default(0)
#  space              :string
#

class CustomElementSerializer < ActiveModel::Serializer
  attributes :id, :project_id, :name, :dimension, :core_material, :shutter_finish, :designer_remark, :photo, 
    :ask_price, :price, :created_at, :space, :updated_at,:category_remark, :image_available, :status, 
    :seen_by_category, :asked_timeline, :timeline, :category_split

  def image_available
  	object.photo_content_type&.in?(["image/png", "image/jpeg", "image/gif", "image/bmp", "image/tiff", "image/svg+xml"])
  end
end

# == Schema Information
#
# Table name: training_materials
#
#  id                   :integer          not null, primary key
#  category_name        :string
#  created_by           :integer
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  training_material_id :integer
#

class TrainingMaterialSerializer < ActiveModel::Serializer
  attributes :id, :category_name
end


class TrainingMaterialDetziledSerializer < ActiveModel::Serializer
  attributes :id, :category_name, :sub_categories

  def sub_categories
    sub_category_arr = []
    object.sub_categories.each do |sub_category|
      sub_category_hash = {}
      sub_category_hash[:id] = sub_category.id
      sub_category_hash[:sub_category_name] = sub_category.category_name
      content_array = []
      sub_category.contents.each do |content|
        content_hash = {}
        content_hash[:id] = content.id
        content_hash[:file_url] = content.document.url
        content_hash[:file_name] = content.document_file_name
        content_hash[:total_page_count] = content.pdf_page_count
        content_array.push content_hash
      end
      sub_category_hash[:training_materials] = content_array
      sub_category_arr.push(sub_category_hash)
    end
    sub_category_arr
  end

  # def training_materials
  #   category_array = []
  #   object.sub_categories.each do |sub_category|
  #     return_hash = Hash.new
  #     return_hash[:category_name] = parent_category.category_name
  #     return_hash[:category_id] = parent_category.id
  #     sub_categories = []
  #     parent_category.sub_categories.each do |sc|
  #       sub_category_hash = Hash.new
  #       sub_category_hash[:id] = sc.id
  #       sub_category_hash[:sub_category_name] = sc.category_name
  #       content_array = []
  #       sc.contents.each do |cont|
  #         content_hash = Hash.new
  #         content_hash[:file_url] = cont.document.url
  #         content_hash[:file_name] = cont.document_file_name
  #         content_array.push content_hash
  #       end
  #       sub_category_hash[:material] = content_array
  #       sub_categories.push sub_category_hash
  #     end
  #     category_array.push return_hash
  #   end
  # end
end

# class SubCategorySerializer < ActiveModel::Serializer
#   attributes :id, :subcategory_name, :training_materials

#   def subcategory_name
#     object.category_name
#   end

#   def training_materials
#     content_array = []
#     object.contents.each do |cont|
#       content_hash = Hash.new
#       content_hash[:file_url] = cont.document.url
#       content_hash[:file_name] = cont.document_file_name
#       content_array.push content_hash
#     end
#     content_array
#   end
# end

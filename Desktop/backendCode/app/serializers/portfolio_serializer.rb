# == Schema Information
#
# Table name: portfolios
#
#  id                           :integer          not null, primary key
#  space                        :string
#  theme                        :string
#  price_cents                  :integer          default(0)
#  segment                      :string
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  lifestage                    :string
#  element                      :string
#  attachment_file_meta         :text
#  description                  :text
#  user_story_title             :string
#  portfolio_data               :json
#

# class PortfolioSerializer < ActiveModel::Serializer
#   # attributes :id, :space, :theme, :price_cents, :segment, :description, :attachment_file,
#   #   :lifestage, :element, :attachment_height, :attachment_width, :attachment_size, :user_story_title, :attr_elem, :portfolio_data
#
#   attributes :id, :space, :theme, :price_cents, :segment, :description, :attachment_file,
#       :lifestage, :element, :attachment_height, :attachment_width, :attachment_size, :user_story_title, :attr_elem
#   def attachment_height
#     object.attachment_file.height
#   end
#   def attachment_width
#     object.attachment_file.width
#   end
#   def attachment_size
#     object.attachment_file.size
#   end
#
#   def attr_elem
#     data = object.portfolio_data
#     attr_arr = []
#     if data.present?
#       data.each do |d|
#         attr_arr = attr_arr+d[1].keys
#         attr_arr=attr_arr.uniq
#       end
#     end
#
#
#     attr_arr
#   end
# end


class PortfolioSerializer < ActiveModel::Serializer
  attributes :id, :space, :theme, :price_cents, :segment, :description, :attachment_file,
            :lifestage, :element, :attachment_height, :attachment_width, :attachment_size, :user_story_title, :attr_elem, :portfolio_data

    def attachment_height
      object.attachment_file.height
    end

    def attachment_width
      object.attachment_file.width
    end

    def attachment_size
      object.attachment_file.size
    end

    def attr_elem
      data = object.portfolio_data
      attr_arr = []
        if data.present?
          data.each do |d|
            attr_arr = attr_arr+d[1].keys if d[1].present?
            attr_arr=attr_arr.uniq
          end
        end
        attr_arr
      end
end

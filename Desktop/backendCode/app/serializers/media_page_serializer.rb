# == Schema Information
#
# Table name: media_pages
#
#  id                :integer          not null, primary key
#  logo_file_name    :string
#  logo_content_type :string
#  logo_file_size    :integer
#  logo_updated_at   :datetime
#  title             :string
#  description       :string
#  read_more_url     :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class MediaPageSerializer < ActiveModel::Serializer
  attributes :id, :logo,:description, :title, :read_more_url
end

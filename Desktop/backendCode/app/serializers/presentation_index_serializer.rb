class PresentationIndexSerializer  < ActiveModel::Serializer
  include ActionView::Helpers::DateHelper
  
  attributes :id, :title, :created_at, :updated_at

  def created_at
    object.created_at.strftime("%e %B %Y")
  end

  def updated_at
    time_ago_in_words(object.updated_at) + " ago"
  end
end
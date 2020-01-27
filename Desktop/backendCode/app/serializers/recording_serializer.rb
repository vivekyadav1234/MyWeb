class RecordingSerializer < ActiveModel::Serializer
  attributes :id, :call_recording, :duration, :note, :user, :project_id, :created_at,
    :updated_at
  belongs_to :event

  attribute :name
  def name
    object.event.agenda.humanize
  end

  def duration
    object.duration.to_s
  end
end

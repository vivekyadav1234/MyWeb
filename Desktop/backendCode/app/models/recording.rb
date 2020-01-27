class Recording < ApplicationRecord
  # Attributes
  # duration, :string
  # user, foreign_key
  # note, :string
  # project, foreign_key
  belongs_to :event
  belongs_to :user
  belongs_to :project
  has_attached_file :call_recording#, content_type: ['','application/octet-stream']
  Paperclip.options[:content_type_mappings] = { :amr => "application/octet-stream" }
  do_not_validate_attachment_file_type :call_recording

  before_validation :check_project_and_event
  def check_project_and_event
    if self.project.nil? && self.event.present?
      if self.event.ownerable_type == "Project"
        self.project = self.event.ownerable
      end
    end
    if self.event.nil? && self.project.present?
      self.event = self.project.events.create(
        agenda: 'follow_up', status: 'done')
    end
    if self.event.nil? && self.project.nil?
      self.errors.add(:event_id, 'Event id is nill. Hence Project Id must be provided.' )
    end
  end
end

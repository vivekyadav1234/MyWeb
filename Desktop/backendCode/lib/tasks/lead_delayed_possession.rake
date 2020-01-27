# This task will find all projects with status delayed_possession/delayed_project, which where
# scheduled for follow_up today (eg if today is 1 Jan-2019, CM had set the project to be delayed to
# March-2019).
# Then these projects will be moved from the delayed bucket to qualified bucket.
# The follow up event will also be marked as done.
namespace :lead do
  task delayed_possession: :environment do
    beginning_time = Date.today.beginning_of_day
    end_time = Date.today.end_of_day
    projects = Project.joins(:events).where(status: ['delayed_possession', 'delayed_project']).
      where(events: { agenda: ['delayed_possession', 'delayed_project'], scheduled_at: beginning_time..end_time }).distinct
    projects.update(status: 'qualified')
    events = Event.where(ownerable_type: 'Project', ownerable_id: projects.pluck(:id)).update(status: "done")
  end
end

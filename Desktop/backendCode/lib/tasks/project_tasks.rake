namespace :project_tasks do
  task send_email_task_owners: :environment do
    project_tasks = ProjectTask.all
    project_tasks.each do |task|
      UserMailer.send_email_task_owners(task).deliver_later
    end
  end
end
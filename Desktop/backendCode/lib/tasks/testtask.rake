namespace :testtask do
  task testtask: :environment do
    User.find_by(email: 'deepak@mailinator.com').update(name: 'deepak')
  end

  task utility_test_mail: :environment do
    UserNotifierMailer.delay.test_email_utility
  end
end
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


puts 'Importing data'

# User.create(name: "customer", email: "customer@test.com", password: "abcd1234") unless User.all.find_by(email: "customer@test.com").present?
# customer = User.all.find_by(email: "customer@test.com")
# if customer.present?
#   customer.confirm
#   customer.role_ids = []
#   customer.add_role :customer
#   (1..3).each do |num|
#     Fabricate(:project, user: customer)
#   end
# end

# User.create(name: "designer", email: "designer@test.com", password: "abcd1234") unless User.all.find_by(email: "designer@test.com").present?
# designer = User.all.find_by(email: "designer@test.com")
# if designer.present?
#   designer.confirm
#   designer.role_ids = []
#   designer.add_role :designer
#   Project.all.last(3).each do |project|
#     designer.designer_projects.create(project_id: project.id)
#   end
# end
# Fabricate.times(5, :lead)

# Fabricate(:user, email: 'test@data.com')
# Fabricate.times(1, :user)

# Creating LeadSource for Referrers roles

  referrers = Role.referrers.pluck(:name)
  referrers.each do |referrer|
    LeadSource.where(name: referrer).first_or_create
  end

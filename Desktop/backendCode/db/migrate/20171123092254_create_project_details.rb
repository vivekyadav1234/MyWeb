class CreateProjectDetails < ActiveRecord::Migration[5.0]
  def change
    create_table :project_details do |t|
      t.string :customer_name
      t.string :mobile_number
      t.string :alternate_mobile
      t.string :email
      t.string :city
      t.string :property_usage
      t.string :property_age
      t.string :property_type
      t.string :number_of_rooms
      t.string :project_name
      t.string :project_address
      t.string :flat_no
      t.integer :area_of_flat
      t.string :possession_status
      t.date :possession_date
      t.string :use_type
      t.string :requirement
      t.integer :budget
      t.string :floor_plan_link
      t.datetime :preferred_time_call_designer
      t.datetime :preferred_time_site_visit
      t.string :occupation_of_customer
      t.string :occupation_of_spouse
      t.integer :members_in_family
      t.date :tentative_date_moving

      t.string :project_type
      t.text :scope_of_work, array: true, null: false, default: []

      t.json :kitchen, null: false, default: {}
      t.json :master_bedroom, null: false, default: {}
      t.json :kids_bedroom, null: false, default: {}
      t.json :parent_bedroom, null: false, default: {}
      t.json :guest_bedroom, null: false, default: {}
      t.json :living_room, null: false, default: {}
      t.json :pooja_room, null: false, default: {}


      t.references :project, foreign_key: true

      t.timestamps
    end
  end
end

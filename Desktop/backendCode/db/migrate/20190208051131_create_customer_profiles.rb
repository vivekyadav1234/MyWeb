class CreateCustomerProfiles < ActiveRecord::Migration[5.0]
  def self.up
    create_table :customer_profiles do |t|
      t.string :name
      t.string :email
      t.string :contact_no
      t.datetime  :dob
      t.string :address_line_1
      t.string :address_line_2
      t.string :city
      t.string :state
      t.string :pincode
      t.string :gender
      t.string :educational_background
      t.string :professional_background
      t.string :sector_employed
      t.string :income_per_annum
      t.string :family_status
      t.string :marital_status
      t.string :joint_family_status
      t.string :no_of_family_members
      t.string :co_decision_maker
      t.string :co_decision_maker_name
      t.string :co_decision_maker_email
      t.string :co_decision_maker_phone
      t.datetime :co_decision_maker_dob
      t.string :relation_with_decision_maker
      t.string :co_decision_maker_educational_background
      t.string :co_decision_maker_professional_background
      t.string :co_decision_maker_sector_employed
      t.string :co_decision_maker_income_per_annum
      t.datetime :movein_date
      t.string :purpose_of_house
      t.references :project
      t.timestamps
    end
  end

  def self.down
    drop_table :customer_profiles
  end
end

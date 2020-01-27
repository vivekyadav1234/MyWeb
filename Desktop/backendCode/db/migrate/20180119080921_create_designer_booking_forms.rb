class CreateDesignerBookingForms < ActiveRecord::Migration[5.0]
  def change
    create_table :designer_booking_forms do |t|
      #General
      t.string :customer_name
      t.integer :customer_age
      t.string :profession
      t.string :family_profession
      t.string :age_house
      t.text :lifestyle
      t.text :house_positive_features
      t.text :house_negative_features
      t.string :inspiration
      t.attachment :inspiration_image
      t.string :color_tones
      t.string :theme
      t.string :functionality
      t.string :false_ceiling
      t.string :electrical_points
      t.string :special_needs
      t.text :vastu_shastra
      t.string :all_at_once
      t.float :budget_range
      t.string :design_style_tastes
      t.string :storage_space
      t.string :mood
      t.string :enhancements
      t.string :discuss_in_person

      #Modular Kitchen
      t.integer :mk_age
      t.string :mk_gut_kitchen
      t.string :mk_same_layout
      t.text :mk_improvements
      t.string :mk_special_requirements
      t.text :mk_cooking_details
      t.string :mk_appliances
      t.string :mk_family_eating_area
      t.string :mk_guest_frequence
      t.string :mk_storage_patterns
      t.string :mk_cabinet_finishing
      t.string :mk_countertop_materials
      t.string :mk_mood

      t.references :project, index: true, foreign_key: true

      t.timestamps
    end
  end
end

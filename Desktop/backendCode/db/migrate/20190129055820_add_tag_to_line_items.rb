class AddTagToLineItems < ActiveRecord::Migration[5.0]
  def change
  	add_reference :boqjobs, :tag, foreign_key: true, null: true
  	add_reference :modular_jobs, :tag, foreign_key: true, null: true
  	add_reference :service_jobs, :tag, foreign_key: true, null: true
  	add_reference :custom_jobs, :tag, foreign_key: true, null: true
  	add_reference :appliance_jobs, :tag, foreign_key: true, null: true
  	add_reference :extra_jobs, :tag, foreign_key: true, null: true
  end
end

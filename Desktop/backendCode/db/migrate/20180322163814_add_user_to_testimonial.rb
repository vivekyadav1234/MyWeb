class AddUserToTestimonial < ActiveRecord::Migration[5.0]
  def change
  	unless column_exists? :testimonials, :user_id
    	add_reference :testimonials, :user
    end
  end
end

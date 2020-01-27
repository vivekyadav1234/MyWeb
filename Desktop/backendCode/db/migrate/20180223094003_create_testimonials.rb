class CreateTestimonials < ActiveRecord::Migration[5.0]
  def change
    create_table :testimonials do |t|
      t.string :name
      t.string :profession
      t.text :testimonial
      t.attachment :video
      t.attachment :thumbnail
      t.boolean :feature
      t.text :video_url

      t.timestamps
    end
  end
end

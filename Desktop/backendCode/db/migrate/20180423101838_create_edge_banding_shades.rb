class CreateEdgeBandingShades < ActiveRecord::Migration[5.0]
  def change
    create_table :edge_banding_shades do |t|
    	t. string :name  
    	t. string :code  
    	t.attachment :shade_image
    	t.references :shutter_finish, index: true, foreign_key: true
      t.timestamps
    end
  end
end

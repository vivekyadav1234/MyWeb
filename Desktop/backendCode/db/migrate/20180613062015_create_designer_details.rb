class CreateDesignerDetails < ActiveRecord::Migration[5.0]
  def change
    create_table :designer_details do |t|
      t.references :designer, index: true, foreign_key: { to_table: 'users' }
      t.string :instagram_handle
      t.attachment :designer_cv
      t.boolean :active , :default => true

      t.timestamps
    end
  end
end

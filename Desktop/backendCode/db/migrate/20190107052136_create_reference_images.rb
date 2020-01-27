class CreateReferenceImages < ActiveRecord::Migration[5.0]
  def change
    create_table :reference_images do |t|
      t.references :project, index: true, foreign_key: true
      t.string :name
      t.timestamps
    end
  end
end

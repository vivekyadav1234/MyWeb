class CreateUserZipcodeMappings < ActiveRecord::Migration[5.0]
  def change
    create_table :user_zipcode_mappings do |t|
      t.references :user
      t.references :zipcode
      t.timestamps
    end
  end
end

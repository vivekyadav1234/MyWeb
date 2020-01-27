class CreateServiceActivities < ActiveRecord::Migration[5.0]
  def change
    create_table :service_activities do |t|
      t.string :name
      t.string :code
      t.string :unit
      t.float :default_base_price
      t.float :installation_price

      t.references :service_category, index: true, foreign_key: true
      t.references :service_subcategory, index: true, foreign_key: true

      t.timestamps
    end

    add_index :service_activities, :code, unique: true
  end
end

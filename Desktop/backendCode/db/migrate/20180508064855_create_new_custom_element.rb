class CreateNewCustomElement < ActiveRecord::Migration[5.0]
  def change
    remove_column  :job_custom_elements, :custom_element_id       
    drop_table 'custom_elements' if ActiveRecord::Base.connection.table_exists? 'custom_elements'
    create_table :custom_elements do |t|
      t.references :project, foreign_key: true
      t.string :name
      t.string :dimension
      t.string :core_material
      t.string :shutter_finish
      t.text :remark
      t.attachment :photo
      t.float :ask_price
      t.float :price
    end
  end
end

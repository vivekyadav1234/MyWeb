class CreatePurchaseElements < ActiveRecord::Migration[5.0]
  def change
    create_table :purchase_elements do |t|
      t.references :purchase_order, index: true, foreign_key: true
      t.references :job_element_vendor, foreign_key: true
      t.timestamps
    end
  end
end

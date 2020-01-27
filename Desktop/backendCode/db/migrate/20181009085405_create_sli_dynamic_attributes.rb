class CreateSliDynamicAttributes < ActiveRecord::Migration[5.0]
  def change
    create_table :sli_dynamic_attributes do |t|
      t.string :attr_value

      t.references :mli_attribute, index: true, foreign_key: true
      t.references :vendor_product, index: true, foreign_key: true

      t.timestamps
    end
  end
end

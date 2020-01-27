class CreateLineItemBoms < ActiveRecord::Migration[5.0]
  def change
    create_table :line_item_boms do |t|
      t.references :content, index: true, foreign_key: true
      t.references :line_item, index: true, polymorphic: true

      t.timestamps
    end
  end
end

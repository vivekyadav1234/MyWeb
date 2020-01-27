class CreateBoqLabels < ActiveRecord::Migration[5.0]
  def change
    create_table :boq_labels do |t|
      t.string :label_name, null: false

      t.references :quotation, index: true, foreign_key: true
      t.references :ownerable, polymorphic: true, index: true

      t.timestamps
    end
  end
end

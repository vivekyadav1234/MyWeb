class CreateMkwLayouts < ActiveRecord::Migration[5.0]
  def change
    create_table :mkw_layouts do |t|
      t.string :category
      t.string :name
      t.text :remark
      t.boolean :global, default: false

      t.references :created_by, index: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end

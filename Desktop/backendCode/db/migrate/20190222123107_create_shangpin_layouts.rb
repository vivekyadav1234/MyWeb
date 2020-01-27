class CreateShangpinLayouts < ActiveRecord::Migration[5.0]
  def change
    create_table :shangpin_layouts do |t|
      t.string :name, null: false
      t.text :remark

      t.references :created_by, index: true, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end

class CreateMliAttributes < ActiveRecord::Migration[5.0]
  def change
    create_table :mli_attributes do |t|
      t.string :attr_name, null: false
      t.string :attr_type, default: 'text_field'
      t.string :attr_data_type, default: 'string'
      t.string :reference_table_name
      t.boolean :required, default: false

      t.references :master_line_item, index: true, foreign_key: true

      t.timestamps
    end
  end
end

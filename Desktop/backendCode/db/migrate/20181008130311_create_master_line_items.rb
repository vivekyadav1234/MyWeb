class CreateMasterLineItems < ActiveRecord::Migration[5.0]
  def change
    create_table :master_line_items do |t|
      t.string :mli_name, null: false
      t.string :mli_type, null: false

      t.timestamps
    end
  end
end

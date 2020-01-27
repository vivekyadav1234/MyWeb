class CreateQuestionaireMasterItems < ActiveRecord::Migration[5.0]
  def change
    create_table :questionaire_master_items do |t|
      t.string :name, null: false
      t.float :price, null: false, default: 0.0
      t.boolean :is_active, null: false, default: true
      t.timestamps
    end
  end
end

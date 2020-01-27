class CreateLeadQuestionaireItems < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_questionaire_items do |t|
      t.string :name, null: false
      t.integer :quantity, null: false, default: 1
      t.float :price, null: false, default: 0.0
      t.float :total, null: false, default: 0.0
      t.references :note_record, index: true, foreign_key: true
      t.timestamps
    end
  end
end

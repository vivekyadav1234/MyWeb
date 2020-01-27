class CreateDpqQuestions < ActiveRecord::Migration[5.0]
  def change
    create_table :dpq_questions do |t|
      t.references :dpq_section, foreign_key: true
      t.text :question

      t.timestamps
    end
  end
end

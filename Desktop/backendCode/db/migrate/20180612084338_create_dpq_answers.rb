class CreateDpqAnswers < ActiveRecord::Migration[5.0]
  def change
    create_table :dpq_answers do |t|
      t.references :dpq_question, foreign_key: true
      t.references :dp_questionnaire, foreign_key: true
      t.text :answer

      t.timestamps
    end
  end
end

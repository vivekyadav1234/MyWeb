class CreateRequirementSpaceQuestionAndAnswers < ActiveRecord::Migration[5.0]
  def change
    create_table :requirement_space_q_and_as do |t|
      t.references :requirement_sheet, foreign_key: true
      t.text :question
      t.text :answer

      t.timestamps
    end
  end
end

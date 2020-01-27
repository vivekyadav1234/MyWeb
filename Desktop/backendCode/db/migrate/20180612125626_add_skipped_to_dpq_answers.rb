class AddSkippedToDpqAnswers < ActiveRecord::Migration[5.0]
  def change
    add_column :dpq_answers, :skipped, :boolean
  end
end

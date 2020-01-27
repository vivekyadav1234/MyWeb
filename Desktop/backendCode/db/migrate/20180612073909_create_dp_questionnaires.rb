class CreateDpQuestionnaires < ActiveRecord::Migration[5.0]
  def change
    create_table :dp_questionnaires do |t|
      t.references :designer, index: true, foreign_key: { to_table: 'users' }
      t.timestamps
    end
  end
end

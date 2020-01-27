class CreateSmsLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :sms_logs do |t|
      t.references :to, index: true, foreign_key: { to_table: :users }
      t.references :from, index: true, foreign_key: { to_table: :users }
      t.references :ownerable, polymorphic: true, index: true
      t.string :message
      t.timestamps
    end
  end
end

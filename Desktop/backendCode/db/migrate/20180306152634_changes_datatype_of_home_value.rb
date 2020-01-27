class ChangesDatatypeOfHomeValue < ActiveRecord::Migration[5.0]
  def change
    change_column :note_records, :home_value, :string
    change_column :note_records, :budget_value, :string
  end
end

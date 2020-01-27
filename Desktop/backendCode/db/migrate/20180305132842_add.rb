class Add < ActiveRecord::Migration[5.0]
  def change
  	add_column :note_records, :society, :string
  	add_column :note_records, :lead_source, :string
  	add_column :note_records, :home_type, :string
  end
end

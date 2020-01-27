class AddReferenceToNoteRecord < ActiveRecord::Migration[5.0]
  def change
    add_reference :note_records, :building_crawler, foreign_key: true
  end
end

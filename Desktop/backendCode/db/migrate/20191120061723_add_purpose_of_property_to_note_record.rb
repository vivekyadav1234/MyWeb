class AddPurposeOfPropertyToNoteRecord < ActiveRecord::Migration[5.0]
  def change
    add_column :note_records, :purpose_of_property, :string
  end
end

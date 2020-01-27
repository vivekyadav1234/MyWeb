class CreateAlternateContacts < ActiveRecord::Migration[5.0]
  def change
    create_table :alternate_contacts do |t|
      t.string :name
      t.string :contact, required: true
      t.string :relation
      t.references :ownerable, polymorphic: true
      t.timestamps
    end
  end
end

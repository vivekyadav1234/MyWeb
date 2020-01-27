class CreateScopeSpaces < ActiveRecord::Migration[5.0]
  def change
    create_table :scope_spaces do |t|
      t.references :scope_of_work, foreign_key: true
      t.string :space_name
      t.string :space_type

      t.timestamps
    end
  end
end

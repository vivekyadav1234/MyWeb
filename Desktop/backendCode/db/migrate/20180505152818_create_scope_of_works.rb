class CreateScopeOfWorks < ActiveRecord::Migration[5.0]
  def change
    create_table :scope_of_works do |t|
      t.references :project, foreign_key: true
      t.text :client_details
      t.datetime :date

      t.timestamps
    end
  end
end

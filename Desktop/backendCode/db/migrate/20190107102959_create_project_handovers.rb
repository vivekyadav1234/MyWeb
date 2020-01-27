class CreateProjectHandovers < ActiveRecord::Migration[5.0]
  def change
    create_table :project_handovers do |t|
      t.references :project, index: true, foreign_key: true
      t.references :ownerable, polymorphic: true
      t.integer :version
      t.boolean :shared, default: false   #1 true => Shared, 0 False => Not Shared
      t.boolean :accepted, default: false #1 true => Accepted, 0 False => Rejected
      t.datetime :shared_on
      t.datetime :status_changed_on
      t.timestamps
    end
  end
end

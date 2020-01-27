class CreateRequestedFiles < ActiveRecord::Migration[5.0]
  def self.up
    create_table :requested_files do |t|
      t.references :raised_by, foreign_key: { to_table: :users}
      t.boolean :resolved, default: false
      t.references :project, forigen_key: true
      t.datetime :resolved_on
      t.string :remarks
      t.timestamps
    end
  end

  def self.down
    drop_table :requested_files
  end
end

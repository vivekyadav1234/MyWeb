class CreateApprovals < ActiveRecord::Migration[5.0]
  def change
    create_table :approvals do |t|
      t.string :type
      t.integer :approved_by, foreign_key: {to_table: :users}
      t.references :approvable, polymorphic: true, index: true  
      t.timestamps
    end
  end
end

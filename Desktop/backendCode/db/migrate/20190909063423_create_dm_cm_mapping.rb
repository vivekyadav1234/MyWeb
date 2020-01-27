class CreateDmCmMapping < ActiveRecord::Migration[5.0]
  def change
    create_table :dm_cm_mappings do |t|
      t.references :dm, index: true, foreign_key: {to_table: :users}
      t.references :cm, index: true, foreign_key: {to_table: :users}

      t.timestamps

      t.index [:dm_id, :cm_id], unique: true
    end
  end
end

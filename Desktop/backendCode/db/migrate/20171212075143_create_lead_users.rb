class CreateLeadUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :lead_users do |t|
      t.references :user, index: true, foreign_key: true
      t.references :lead, index: true, foreign_key: true

      t.string :claimed, default: "pending"
      t.datetime :processed_at

      t.timestamps
    end

    remove_column :leads, :user_id, :integer
  end
end

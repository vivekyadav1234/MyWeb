class ChangeColumnsInPayments < ActiveRecord::Migration[5.0]
  def up
	add_column :payments, :ownerable_id, :integer
	add_column :payments, :ownerable_type, :string
	add_column :payments, :description, :string
  end

  def down
  	remove_column :payments, :ownerable_id
    remove_column :payments, :ownerable_type
    remove_column :payments, :description, :string
  end
end

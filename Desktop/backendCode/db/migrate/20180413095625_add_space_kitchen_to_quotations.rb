class AddSpaceKitchenToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :spaces_kitchen, :text, array: true, default: []
  end
end

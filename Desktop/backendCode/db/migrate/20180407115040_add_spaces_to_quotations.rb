class AddSpacesToQuotations < ActiveRecord::Migration[5.0]
  def change
    add_column :quotations, :spaces, :text, array: true, default: []
  end
end

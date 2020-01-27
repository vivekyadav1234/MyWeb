class AddRemarkToEvents < ActiveRecord::Migration[5.0]
  def change
    add_column :events, :remark, :string
  end
end

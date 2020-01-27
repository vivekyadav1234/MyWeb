class AddSidToInhouseCalls < ActiveRecord::Migration[5.0]
  def change
    add_column :inhouse_calls, :sid, :string
  end
end

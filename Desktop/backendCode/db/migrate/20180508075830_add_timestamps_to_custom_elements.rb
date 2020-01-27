class AddTimestampsToCustomElements < ActiveRecord::Migration[5.0]
  def change
  	change_table :custom_elements do |t|
            t.timestamps
    end
  end
end

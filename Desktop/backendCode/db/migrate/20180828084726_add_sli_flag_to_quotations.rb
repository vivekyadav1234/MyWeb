class AddSliFlagToQuotations < ActiveRecord::Migration[5.0]
  def change
  	add_column :quotations, :sli_flag, :string
  end
end

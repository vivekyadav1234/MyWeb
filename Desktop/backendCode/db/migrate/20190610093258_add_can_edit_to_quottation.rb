class AddCanEditToQuottation < ActiveRecord::Migration[5.0]
  def change
    add_column  :quotations, :can_edit, :boolean, default:true
  end
end

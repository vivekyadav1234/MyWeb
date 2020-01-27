class AddImageToPayments < ActiveRecord::Migration[5.0]
  def change
    add_attachment :payments, :image
  end
end

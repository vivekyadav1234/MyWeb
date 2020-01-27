class AddAttachmentToPiPayments < ActiveRecord::Migration[5.0]
  def change
    add_attachment :pi_payments, :attachment
  end
end

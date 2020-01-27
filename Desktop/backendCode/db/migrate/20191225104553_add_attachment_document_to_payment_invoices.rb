class AddAttachmentDocumentToPaymentInvoices < ActiveRecord::Migration
  def self.up
    change_table :payment_invoices do |t|
      t.attachment :document
    end
  end

  def self.down
    remove_attachment :payment_invoices, :document
  end
end

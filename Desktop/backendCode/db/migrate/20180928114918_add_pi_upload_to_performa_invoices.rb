class AddPiUploadToPerformaInvoices < ActiveRecord::Migration[5.0]
  def change
    add_attachment :performa_invoices, :pi_upload
  end
end

# == Schema Information
#
# Table name: performa_invoices
#
#  id                     :integer          not null, primary key
#  quotation_id           :integer
#  vendor_id              :integer
#  amount                 :float
#  description            :string
#  reference_no           :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  base_amount            :float            default(0.0)
#  tax_percent            :float            default(0.0)
#  pi_upload_file_name    :string
#  pi_upload_content_type :string
#  pi_upload_file_size    :integer
#  pi_upload_updated_at   :datetime
#  purchase_order_id      :integer
#

class PerformaInvoiceSerializer < ActiveModel::Serializer
  attributes :id, :total_amount, :base_value, :tax_value, :balance, :pi_payments, :invoice_files

  def total_amount
    object.total_amount
  end

  def base_value
    object.base_value
  end

  def tax_value
    object.tax_value
  end

  def balance
    object.balance
  end

  def pi_payments
    object.pi_payments.map { |pi_payment|
      PiPaymentSerializer.new(pi_payment).serializable_hash
    }
  end

  def invoice_files
  	files = []
  	object.performa_invoice_files.each do |file|
  		files << {
  			id: file.id,
  			attachment_file_file_name: file.attachment_file_file_name,
  			attachment_file_content_type: file.attachment_file_content_type,
  			attachment_file_file_size: file.attachment_file_file_size,
  			created_at: file.created_at,
        url: file.attachment_file.url,
        tax_invoice: file.tax_invoice
  		}
  	end
  	files
  end
end

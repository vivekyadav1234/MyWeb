# == Schema Information
#
# Table name: performa_invoice_files
#
#  id                           :integer          not null, primary key
#  performa_invoice_id          :integer
#  attachment_file_file_name    :string
#  attachment_file_content_type :string
#  attachment_file_file_size    :integer
#  attachment_file_updated_at   :datetime
#  tax_invoice                  :boolean          default(FALSE)
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#

class PerformaInvoiceFile < ApplicationRecord
  belongs_to :performa_invoice
  
  has_attached_file :attachment_file, default_url: "/images/:style/missing.png", validate_media_type: false
  do_not_validate_attachment_file_type :attachment_file
end

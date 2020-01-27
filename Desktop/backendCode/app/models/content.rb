# == Schema Information
#
# Table name: contents
#
#  id                    :integer          not null, primary key
#  ownerable_type        :string
#  ownerable_id          :integer
#  document_file_name    :string
#  document_content_type :string
#  document_file_size    :integer
#  document_updated_at   :datetime
#  scope                 :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#

class Content < ApplicationRecord
	has_paper_trail
  belongs_to :ownerable, polymorphic: true, optional: true

  # For BOMs uploaded against a Line Item of a Quotation. Obviously, line items can belong to several different models.
  # Not applicable to ServiceJob.
  # Not applicable to ShangpinJob as of now - this may change in the future with more clarity on Shangpin BOM-SLI.
  has_many :line_item_boms, dependent: :destroy
  has_many :boqjobs, through: :line_item_boms, source: :line_item, source_type: 'Boqjob'
  has_many :modular_jobs, through: :line_item_boms, source: :line_item, source_type: 'ModularJob'
  has_many :appliance_jobs, through: :line_item_boms, source: :line_item, source_type: 'ApplianceJob'
  has_many :custom_jobs, through: :line_item_boms, source: :line_item, source_type: 'CustomJob'
  has_many :extra_jobs, through: :line_item_boms, source: :line_item, source_type: 'ExtraJob'

  after_save :set_pdf_page_count

  has_attached_file :document, :default_url => "/images/:style/missing.png"
  # validates_attachment_content_type :document, :content_type => [/\Aimage\/.*\Z/, "application/pdf","text/xml","application/zip",'application/octet-stream', 'text/plain', 'text/csv','application/x-csv', 'application/csv','application/vnd.ms-excel', 'text/comma-separated-values',
  #                                                                'text/x-comma-separated-values','text/tab-separated-values',"application/excel","application/vnd.msexcel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
	do_not_validate_attachment_file_type :document
  Paperclip.options[:content_type_mappings] = { :csv => "text/plain" }
  # ALLOWED_SCOPES = ["vendor_gst", "upload_elevation", "reference_image", "three_d_image", "project_handover_zip_file", "dd_list",
    # "bom", "cutting_list", "hardware_list", "imos", "training_material", "customer_inspiration"]
  ALLOWED_SCOPES = ["vendor_gst", "upload_elevation", "reference_image", "three_d_image", "project_handover_zip_file", "dd_list", 
    "training_material", "customer_inspiration","quality_check", "dispatch_schedule", "design_qc", "cost_qc", "tech_qc", "send_to_factory_zip_file", "line_marking"]
  ALLOWED_SCOPES_BOM = ["bom_sli_manual_sheet", "imos_manual_sheet", "imos"] #This should match the array of possible values of IMPORT_TYPE for Jobelement. 

  validates_inclusion_of :scope, in: ( ALLOWED_SCOPES + ALLOWED_SCOPES_BOM )

  def set_pdf_page_count
    ContentPdfPageCountJob.perform_later(self)
  end
end

class EditTablesForNewBoq < ActiveRecord::Migration[5.0]
  def change
    add_column :boqjobs, :ppt_linked, :boolean, default: false
    add_reference :boqjobs, :product_variation, index: true, foreign_key: true
    add_reference :boqjobs, :section, index: true, foreign_key: true
    remove_column :boqjobs, :description, :string
    remove_column :boqjobs, :tax_name, :string
    remove_column :boqjobs, :tax_value, :float
    remove_column :boqjobs, :tax_id, :integer
    remove_column :boqjobs, :percent_discount, :float
    remove_column :boqjobs, :job_type, :string
    remove_column :boqjobs, :unit, :string
    remove_column :boqjobs, :hsn_code, :string

    add_column :quotations, :reference_number, :string
    add_reference :quotations, :presentation, index: true, foreign_key: true
    rename_column :quotations, :gross_amount, :flat_amount
    remove_column :quotations, :description, :text
    remove_column :quotations, :saved_tax_data, :json
    remove_column :quotations, :rolable_id, :integer
    remove_column :quotations, :rolable_type, :string
    remove_column :quotations, :quotationable_id, :integer
    remove_column :quotations, :quotationable_type, :string
    remove_column :quotations, :quotation_type, :string

    add_column :invoices, :reference_number, :string
    add_reference :invoices, :quotation, index: true, foreign_key: true
    remove_column :invoices, :description, :text
    remove_column :invoices, :saved_tax_details, :json
    remove_column :invoices, :rolable_id, :integer
    remove_column :invoices, :rolable_type, :string
    remove_column :invoices, :invoicable_id, :integer
    remove_column :invoices, :invoicable_type, :string
  end
end

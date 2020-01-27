class PaymentReleaseLineItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :reference_number, :sli_flag, :project_id
  attribute :vendors

  def vendors
    vendors = Vendor.joins(:performa_invoices).where(performa_invoices: { id: object.performa_invoices }).distinct
  
    vendors.map do |vendor|
      h = Hash.new
      h[:vendor_details] = vendor.attributes.slice("id", "name")
      # v_purchase_orders = purchase_orders.where(vendor: vendor)
      v_performa_invoices = object.performa_invoices.where(vendor: vendor)
      h[:total_invoice_value] = v_performa_invoices.pluck(:amount).sum.round(0)
      # count of SLIs for which PO was not released.
      h[:po_not_released_count] = object.job_elements.left_outer_joins(:purchase_elements).where(purchase_elements: { id: nil }).distinct.count

      h[:pi_details] = v_performa_invoices.map do |pi|
        pi_details = pi.attributes.slice(
          "id", 
          "reference_no", 
          "base_amount", 
          "tax_percent", 
          "amount"
          )
        pi_details[:po_details] = pi.purchase_orders.map{|po| po.attributes.slice("id", "reference_no")}
        pi_details[:total_payment_released] = pi.pi_payments.approved.map(&:total_amount).sum.round(2)
        pi_details[:pending_payment_counts] = pi.pi_payments.pending.count
        pi_details[:payment_status] = pi.payment_status
        pi_details
      end

      h
    end
  end
end

class PurchaseOrderJob < ApplicationJob
   queue_as :report_mailer
   
   def perform(user)
   	 purchase_order_excel = PurchaseOrder.purchase_order_report
     UserNotifierMailer.po_report_email(purchase_order_excel[:filepath], purchase_order_excel[:file_name], user.email).deliver_now
     File.delete(purchase_order_excel[:filepath]) if File.exist?(purchase_order_excel[:filepath])  
   end
end
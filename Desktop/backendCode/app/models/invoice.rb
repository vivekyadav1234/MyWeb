# == Schema Information
#
# Table name: invoices
#
#  id               :integer          not null, primary key
#  name             :string
#  terms            :text
#  net_amount       :float            default(0.0)
#  total_amount     :float            default(0.0)
#  status           :integer          default(0)
#  project_id       :integer
#  user_id          :integer
#  invoicing_date   :date
#  due_date         :date
#  due_in_days      :integer          default(0)
#  payment_status   :integer          default("unpaid")
#  billing_address  :string
#  total_discount   :float            default(0.0)
#  gross_amount     :float            default(0.0)
#  customer_notes   :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  reference_number :string
#  quotation_id     :integer
#  designer_id      :integer
#

class Invoice < ApplicationRecord

  #track changes
  has_paper_trail
  
  #associations
  belongs_to :project
  belongs_to :user
  belongs_to :designer, class_name: 'User'
  belongs_to :quotation

  #enums
  enum payment_status: [:unpaid, :paid, :partly_paid]

  #validations
  validates_presence_of :payment_status
  validates_presence_of :reference_number

  before_validation :ensure_reference_presence

  def ensure_reference_presence
    self.reference_number = generate_reference_number if self.reference_number.blank?
  end

  def generate_reference_number
    sno = Invoice.count + 1

    10000.times do
      ref_no = "INV/#{Date.today.year}/#{sno}"
      if Invoice.find_by(reference_number: ref_no).present?
        sno += 1
        next
      else
        return ref_no
      end
    end

    # Even looping 10000 times didn't help. Generate a random ref no now.
    return "INV/#{Date.today.year}/R#{rand(Invoice.count+1..1000000)}"
  end


end

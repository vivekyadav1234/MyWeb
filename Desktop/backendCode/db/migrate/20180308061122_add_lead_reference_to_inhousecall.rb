class AddLeadReferenceToInhousecall < ActiveRecord::Migration[5.0]
  def change
    add_reference :inhouse_calls, :lead
  end
end

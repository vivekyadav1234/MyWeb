class Emicalculator
  ARRIVAE_RATE = 8.55
  def initialize(principal, rate, tenure)
    @principal = principal.to_f  #Principal amount
    @rate = rate.to_f * 0.01  #Annual interest rate - 12% means 12/100 ie 0.12
    @tenure = tenure #Duration over which EMI payments will be made, in months. 2year -> 24
  end

  def emi_hash
    hash = Hash.new
    emi = monthly_emi
    arrivae_emi = monthly_emi(@principal,8.55*0.01/12,@tenure)
    emi_saving = emi - arrivae_emi
    amount = total_amount
    total_saving = amount - arrivae_emi*@tenure
    hash[:emi] = emi.round(2)
    hash[:total_amount] = amount.round(2)
    hash[:interest_amount] = (hash[:total_amount] - @principal).round(2)
    hash[:arrivae_emi] = arrivae_emi.round(2)
    hash[:emi_saving] = emi_saving.round(2)
    hash[:total_saving] = total_saving.round(2)
    hash
  end

  private
  def monthly_emi(p=nil,r=nil,n=nil)
    p ||= @principal
    r ||= @rate/12
    n ||= @tenure
    # puts "#{p}, #{r}, #{n}"
    emi = p * r * ((1+r)**n)/(((1+r)**n)-1)
  end

  # Total amount paid over duration of loan.
  def total_amount
    monthly_emi * @tenure
  end
end
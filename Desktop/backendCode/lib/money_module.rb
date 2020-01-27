module MoneyModule
  # convert given number (in INR) into indian currency format, using the Money gem.
  # IMP: The gem takes number in paise. So, if you want INR 1,000, then provide 100000 as the argument.
  def self.indian_format(amount_in_rupees)
    Money.new(amount_in_rupees.to_f.round(0) * 100, "INR").format(no_cents: true, symbol: false, south_asian_number_formatting: true)
  end

  def self.to_words(num)
    numbers_to_name = {
        10000000 => "crore",
        100000 => "lakh",
        1000 => "thousand",
        100 => "hundred",
        90 => "ninety",
        80 => "eighty",
        70 => "seventy",
        60 => "sixty",
        50 => "fifty",
        40 => "forty",
        30 => "thirty",
        20 => "twenty",
        19=>"nineteen",
        18=>"eighteen",
        17=>"seventeen", 
        16=>"sixteen",
        15=>"fifteen",
        14=>"fourteen",
        13=>"thirteen",              
        12=>"twelve",
        11 => "eleven",
        10 => "ten",
        9 => "nine",
        8 => "eight",
        7 => "seven",
        6 => "six",
        5 => "five",
        4 => "four",
        3 => "three",
        2 => "two",
        1 => "one"
      }

    log_floors_to_ten_powers = {
      0 => 1,
      1 => 10,
      2 => 100,
      3 => 1000,
      4 => 1000,
      5 => 100000,
      6 => 100000,
      7 => 10000000
    }

    num = num.to_i
    return '' if num <= 0 or num >= 100000000

    log_floor = Math.log(num, 10).floor
    ten_power = log_floors_to_ten_powers[log_floor]

    if num <= 20
      numbers_to_name[num]
    elsif log_floor == 1
      rem = num % 10
      [ numbers_to_name[num - rem], to_words(rem) ].join(' ')
    else
      [ to_words(num / ten_power), numbers_to_name[ten_power], to_words(num % ten_power) ].join(' ')
    end
  end  
end
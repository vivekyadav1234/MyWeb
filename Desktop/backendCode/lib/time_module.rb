module TimeModule
  def self.time_to_hours(time_str)  
    hours, minutes, seconds = time_str.split(":").map{|str| str.to_i}  
    hours + minutes/60.0 + seconds/(60.0 * 60.0)
  # rescue          # do any additional error handling here  
  #   return false
  end  
end
class SandboxMailInterceptor
  def self.delivering_email(message)
    test_email_destination = 'hello@gloify.com'
    # test_email_destination_cc = 'arunoday@gloify.com'

    development_information =  "TO: #{message.to.inspect}"
    development_information << " CC: #{message.cc.inspect}"   if message.cc.try(:any?)
    development_information << " BCC: #{message.bcc.inspect}" if message.bcc.try(:any?)

    # if app_domain_email = message.to.to_a.select { |e| e.to_s.match(/gloify\.com/) }.first
    #   message.to = [test_email_destination, app_domain_email]
    # else
    #   message.to = [test_email_destination]
    # end
    message.to = [test_email_destination]
    # message.cc = [test_email_destination_cc]
    message.bcc = nil

    message.subject = "#{message.subject} | #{development_information}"
  end
end

if Rails.env.uat?
  ActionMailer::Base.register_interceptor(SandboxMailInterceptor)
end

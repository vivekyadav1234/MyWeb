module UploadSamplePpt
  def upload_ppt
      file_name = 'DELTA MAX PPT PRESENTATION - FINAL.pptx'
      file_path = Rails.root.join("app", "data", 'sample ppt', file_name)
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(file_name)
      obj.upload_file(file_path, { acl: 'private' }) 
  end

  def upload_files
    file_names = ['file_booklet.pdf', 'Customisation_booklet_A4.pdf']
    file_names.each do |file_name|
      file_path = Rails.root.join("app", "data", 'sample ppt', file_name)
      s3 = Aws::S3::Resource.new
      obj = s3.bucket(ENV["AWS_S3_BUCKET"]).object(file_name)
      obj.upload_file(file_path, { acl: 'private' })
    end  
  end    
end


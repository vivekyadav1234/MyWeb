class VendorFullInformationSerializer < VendorSerializer
  attributes   :account_holder, :account_number, :bank_name, :branch_name, :ifsc_code,
               :pan_copy, :gst_copy, :cancelled_cheque, :city, :vendor_sub_categories,
               :serviceable_cities, :gst_files, :dd_files

  def vendor_sub_categories
    arr = []
    @sub_categories = object.sub_categories
    if @sub_categories.present?
      @sub_categories.each do |sub_category|
        hash = Hash.new
        hash["id"] = sub_category&.id
        hash["category_name"] = sub_category&.category_name
        hash["parent_category_id"] = sub_category&.parent_category_id
        hash["parent_category_name"] = sub_category&.parent_category.category_name
        hash["created_at"] = sub_category&.created_at
        hash["updated_at"] = sub_category&.updated_at
        arr.push(hash)
      end
    end
    arr
  end

  def gst_files
    files_array = []
    object.contents.where(scope: "vendor_gst").each_with_index do |image|
      files_hash = Hash.new
      files_hash[:id] = image.id
      files_hash[:url] = image.document.url
      begin
        files_hash[:base64_code] = "data:application/pdf;base64," + Base64.encode64(open("#{image.document.s3_object.presigned_url("get", expires_in: 30.seconds)}").read)
      rescue StandardError => e
        files_hash[:base64_code] = nil
      end
      files_array.push files_hash
    end
    files_array
  end

  def dd_files
    files_array = []
    object.contents.where(scope: "dd_list").each_with_index do |image|
     files_array.push({id: image.id, url: image.document.url, file_name: image.document_file_name})
    end
    files_array
  end

  def serviceable_cities
    @serviceable_cities = object.serviceable_cities
  end

end
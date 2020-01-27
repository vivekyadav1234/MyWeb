class FjsBoqAndPptUploadSerializer
	include FastJsonapi::ObjectSerializer
	def serializable_hash
			data = super
			data[:data]
		end
	attributes :id, :name, :upload, :upload_file_name, :updated_at

end
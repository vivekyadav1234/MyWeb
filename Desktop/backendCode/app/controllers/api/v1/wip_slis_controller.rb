class Api::V1::WipSlisController < Api::V1::ApiController
	before_action :set_wip_sli, only: [:update, :destroy, :view_options,:change_wip_sli]
  # load_and_authorize_resource :wip_sli

	def create
		@wip_sli = WipSli.create(sli_params)
		@wip_sli.amount = (@wip_sli.vendor_product.rate.to_f + (@wip_sli.vendor_product.rate.to_f * @wip_sli.tax.to_f/100)) * @wip_sli.quantity
		if @wip_sli.save!
			render json: {message: "Successfully created"}, status: 200
		else
			render json: {message: @wip_sli.errors.full_messages}, status: :unprocessable_entity
		end
	end

	def update
		@wip_sli.update(sli_params)
		if @wip_sli.custom?
			@wip_sli.amount = (@wip_sli.rate.to_f + (@wip_sli.rate.to_f * @wip_sli.tax.to_f/100)) * @wip_sli.quantity
		else
			@wip_sli.amount = (@wip_sli.vendor_product.rate.to_f + (@wip_sli.vendor_product.rate.to_f * @wip_sli.tax.to_f/100)) * @wip_sli.quantity
		end
		if @wip_sli.save!
			render json: {message: "Successpully Updated"}, status: 200
		else
			render json: {message: @wip_sli.errors.full_messages}, status: :unprocessable_entity
		end
	end

	def index
		@vendor_wise_wip_slis = WipSli.where(sli_type: params[:type]).order(vendor_id: :asc).group_by{ |c| c.vendor_id }
		has_to_render = {vendor_wise_wip_slis: []}
		@vendor_wise_wip_slis.each do |vendor_wise_wip_sli|
			@vendor = Vendor.find_by id: vendor_wise_wip_sli[0]
			if @vendor.present?
				slis = {}
				slis[:vendor_id] = @vendor.id
				slis[:vendor_name] = @vendor.name
				slis[:vendor_email] = @vendor.email
				slis[:vendor_contact] = @vendor.contact_number
				slis[:vendor_pan_no] = @vendor.pan_no
				slis[:vendor_gst_reg_no] = @vendor.gst_reg_no
				slis[:vendor_address] = @vendor.address
				slis[:over_all_status ] = vendor_wise_wip_sli[1].pluck(:status).uniq&.length == 1 && vendor_wise_wip_sli[1].pluck(:status).uniq.include?("po_created") ? "po_created" : "pending"
				slis[:wip_slis] = WipSliSerializer.new(vendor_wise_wip_sli[1]).serializable_hash
				has_to_render[:vendor_wise_wip_slis].push(slis)
			else
				next
			end
		end
		render json: has_to_render, status: 200
	end

	def destroy
		if @wip_sli.destroy!
			render json: {message: "Successpully Deleted"}, status: 200
		else
			render json: {message: @wip_sli.errors.full_messages}, status: :unprocessable_entity
		end
	end


	def view_options
		vendor_product = @wip_sli.vendor_product
		if vendor_product.blank? || vendor_product.sli_group_code.blank?
			@vendor_products = VendorProduct.none
		else
			@vendor_products = VendorProduct.where(sli_group_code: vendor_product.sli_group_code)
		end

		render json: @vendor_products
	end

	def change_wip_sli
    vendor_product = @wip_sli.vendor_product
    unless vendor_product.present?
      return render json: {message: "This is allowed only for SLIs which are linked to a Master SLI."}, status: :unprocessable_entity
    end

		if @wip_sli.po_wip_orders.present? && ["po_created","po_recieved"].include?(@wip_sli.status)
			return render json: {message: "PO has been created for this SLI"}, status: :unprocessable_entity
		end

		new_vendor_product = VendorProduct.find params[:vendor_product_id]
    @new_wip_sli = WipSli.create(quantity: @wip_sli.quantity, tax_type: @wip_sli.tax_type, tax: @wip_sli.tax, vendor_product_id: new_vendor_product.id, sli_type: params[:sli_type])
		@new_wip_sli.amount = (new_vendor_product.rate.to_f + (new_vendor_product.rate.to_f * @new_wip_sli.tax.to_f/100)) * @new_wip_sli.quantity
    if @new_wip_sli.save
			@wip_sli.destroy
      render json: @new_wip_sli, status: :created
    else
      render json: {message: @new_wip_sli.errors.full_messages}, status: :unprocessable_entity
    end
    rescue ActiveRecord::InvalidForeignKey
      render json: {message: "This item cannot be replaced as it is in use."}, status: :unprocessable_entity
	end


	def add_custom_sli
		params[:custom_slis].each do |sli|
			wip_sli = WipSli.create!(quantity: sli[:quantity], tax_type: sli[:tax_type], tax: sli[:tax], vendor_id: sli[:vendor_id], name: sli[:name], rate: sli[:rate], unit: sli[:unit], sli_type: sli[:sli_type], custom: true )
			wip_sli.amount = (sli[:rate].to_f + (sli[:rate].to_f * (sli[:tax].to_f/100))) * sli[:quantity]
			wip_sli.save!
		end
		render json: {message: "Successfully Created"}, status: 200
	end


	private
		def set_wip_sli
			@wip_sli = WipSli.find_by(id: params[:id])
		end

		def sli_params
	    params.require(:wip_sli).permit(:quantity, :tax_type, :tax, :vendor_product_id, :vendor_id, :sli_type, :custom)
	  end
end

class Api::V1::PoWipOrdersController < Api::V1::ApiController
	before_action :set_po_wip_order, only: [:update, :destroy, :take_action_on_po, :get_full_line_items, :receive_po, :po_wip_order_view]

	def create
		if params[:wip_sli_ids].present?
			wip_slis = WipSli.where(id: params[:wip_sli_ids])
			po_wips = PoWipOrdersWipSli.where(wip_sli_id: params[:wip_sli_ids])
			po = PoWipOrder.find_by(id: po_wips.first.po_wip_order_id) if po_wips.present?
			if po.present? && po.status != "cancelled"
				po.update(po_params)
				po.update(status: "pending")
				po.po_wip_orders_wip_slis.destroy_all
				wip_slis_array = []
				params[:wip_sli_ids].map{|id| wip_slis_array.push({wip_sli_id: id})}

				if po.po_wip_orders_wip_slis.create!(wip_slis_array)
					po.update_status_and_quantities
					wip_slis.map{|sli| sli.update(status: "po_created")}
					pdf_out = po.po_pdf_generation(current_user)
					UserNotifierMailer.bulk_po_created(pdf_out[:file_name], pdf_out[:filepath], "Created", po.wip_slis.first.vendor, params[:type]).deliver_now!
					render json: {message: "Successpully Modified"}, status: 200
				else
					render json: {message: po.errors.full_messages}, status: :unprocessable_entity
				end

				# po.update_status_and_quantities
				# wip_slis.map{|sli| sli.update(status: "po_created")}
				# pdf_out = po.po_pdf_generation(current_user)
				# UserNotifierMailer.bulk_po_created(pdf_out[:file_name], pdf_out[:filepath], "Modified", po.wip_slis.first.vendor_product.vendor).deliver_now!
				# render json: {message: "Successpully Modified"}, status: 200
			else
				@po_wip_order = PoWipOrder.create(po_params)
				@po_wip_order.update(po_params)
				@po_wip_order.update(status: "pending")
				wip_slis_array = []
				params[:wip_sli_ids].map{|id| wip_slis_array.push({wip_sli_id: id})}
				if @po_wip_order.po_wip_orders_wip_slis.create!(wip_slis_array)
					@po_wip_order.update_status_and_quantities
					wip_slis.map{|sli| sli.update(status: "po_created")}
					pdf_out = @po_wip_order.po_pdf_generation(current_user)
					UserNotifierMailer.bulk_po_created(pdf_out[:file_name], pdf_out[:filepath], "Created", @po_wip_order.wip_slis.first.vendor, params[:type]).deliver_now!
					render json: {message: "Successpully Created"}, status: 200
				else
					render json: {message: @po_wip_order.errors.full_messages}, status: :unprocessable_entity
				end
			end
		else
			render json: {message: "please provide sli ids"}
		end
	end

	def take_action_on_po
		@po_wip_order.update(status: params[:status])
		@vendor = @po_wip_order.wip_slis.first.vendor
		if @po_wip_order.status == "modify_po"
			@po_wip_order.wip_slis.map{|sli| sli.update(status: "modify_po")}
			UserNotifierMailer.bulk_po_modification(@vendor, @po_wip_order).deliver_now!
		elsif @po_wip_order.status == "cancelled"
			@po_wip_order.wip_slis.map{|sli| sli.update(status: "cancelled")}
			UserNotifierMailer.bulk_po_canceled(@vendor, @po_wip_order).deliver_now!
		end
		render json: {message: "Updated Status"}, status: 200
	end

	def receive_po
		if params[:received_slis].present?
			@po_wip_order.update(status: "po_recieved") if @po_wip_order.status != "po_recieved"
			params[:received_slis].each do |received_sli|
				po_wip_orders_wip_sli = PoWipOrdersWipSli.find received_sli[:id]
				quantity = po_wip_orders_wip_sli.quantity.to_f
				parent_id = po_wip_orders_wip_sli.parent_wip_sli_id.present? ? po_wip_orders_wip_sli.parent_wip_sli_id : po_wip_orders_wip_sli.id
				po_wip_orders_wip_sli.update(recieved_quantity: received_sli[:quantity], recieved_at: DateTime.now)
				po_wip_orders_wip_sli.add_to_inventory
				if po_wip_orders_wip_sli.recieved_quantity < quantity
					PoWipOrdersWipSli.create!(parent_wip_sli_id: parent_id, quantity: (quantity - po_wip_orders_wip_sli.recieved_quantity), wip_sli_id: po_wip_orders_wip_sli.wip_sli_id, po_wip_order: po_wip_orders_wip_sli.po_wip_order)
				end
			end
			render json: {message: "Po Recieved"}, status: 200
		else
			render json: {message: "plrase provide propper parameters"}, status: :unprocessable_entity
		end
	end

	def index
		type = params[:type].present? ? params[:type] : [nil, ""]
		pos = PoWipOrder.where(po_type: type).order(created_at: :asc)
		if pos.present?
			hash = PoWipOrderSerializer.new(pos).serializable_hash
			puts "======="
			puts hash
			puts "+++++++"
			render json: hash	, status: 200
		else
			render json: {message: "No Data Found"}, status: 204
		end
	end

	def get_full_line_items
		render json: CompletePoWipOrderSerializer.new(@po_wip_order).serializable_hash, status: 200
	end

	def destroy

	end

	def po_wip_order_view
    pdf_out = @po_wip_order.po_pdf_generation(current_user)
		return render json: pdf_out, status: 200
  end


	private

		def set_po_wip_order
			@po_wip_order = PoWipOrder.find_by id: params[:id]
		end

		def po_params
			params.require(:po_wip_order).permit(:billing_address, :billing_contact_person, :billing_contact_number, :shipping_address, :shipping_contact_number, :shipping_contact_person, :lead_id, :vendor_gst, :po_type, :tag_snag)
		end
end

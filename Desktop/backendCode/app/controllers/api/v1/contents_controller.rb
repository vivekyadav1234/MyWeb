class Api::V1::ContentsController < Api::V1::ApiController
  before_action :set_content, only: [:destroy, :destroy_bom]
  
  # This is temporary end point. This might change if file processing required.
  # If file processing is not required then this will work.
  # This has to be modified accordingly in future.
  # 19-06-2019: End point is getting changed to accommodate file processing. How it works:
  # 1. Read file provided. Based on the labels in it, we will find the line items affected.
  # 2. First, upload this file as a BOM file and tag it against all the line items found.
  # 3. Then, process the data in the file and add SLIs against the appropriate line items.
  # 4. Return an array of infor/warnings/errors. This should be shown to the user by the front-end.
  # 19-06-2019: END
  def upload_cutting_list_and_boms
    @quotation = Quotation.find params[:quotation_id].to_i
    scope = params[:content][:scope]
    errors = []
    if params[:content].present?
      @content = Content.create!(permited_params(params[:content]))
      # First get the excel workbook
      # str = params[:content][:document].gsub("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,","")
      # filepath = Rails.root.join("tmp").join("bom_sli_manual_sheet-#{Time.zone.now}.xlsx")
      # File.open(filepath, "wb") do |f|
      #   f.write(Base64.decode64(str))
      #   f.close
      # end
      workbook = Roo::Spreadsheet.open Paperclip.io_adapters.for(@content.document)

      options = {
        workbook: workbook,
        content: @content
      }

      # Now import based on scope.
      case scope
      when 'bom_sli_manual_sheet'
        errors = BomSliModule::ManualSheetImport.new(@quotation, options).import_excel
      when 'imos_manual_sheet'
        errors = BomSliModule::ImosManualSheetImport.new(@quotation, options).import_excel
      when 'imos'
        errors = ImosImportModule::ImosImport.new(@quotation, options).import_excel
      end

      render json: errors.to_json
    else
      render json: {message: 'Missing :content parameter'}, status: 400
    end
  end

  def destroy
    @content.destroy
  end

  def destroy_bom
    @quotation = Quotation.find params[:quotation_id].to_i
    options = { 
      workbook: Roo::Spreadsheet.open(Paperclip.io_adapters.for(@content.document)),
      content: @content
    }

    begin
      return_value = @quotation.destroy_bom(options)
      case return_value
      when -2
        return render json: {message: "SLIs with PO exist for labels in this BOM. This file cannot be deleted."}, status: :unprocessable_entity
      when -1
        return render json: {message: "Content scope must be one of #{ALLOWED_SCOPES_BOM.join(',')}."}, status: :unprocessable_entity
      when 0
        return render json: {message: "File successfully deleted and related SLIs of type #{@content.scope.humanize} have been deleted."}
      end
    rescue ActiveRecord::InvalidForeignKey
      return render json: {message: "This BOM file cannot be deleted as it is in use. The most likely reason is that the line items related to labels in the file have SLIs against them for which PO has already been raised."}, status: :unprocessable_entity
    rescue StandardError
      return render json: {message: "An error occurred and the file could not be deleted. Please contact the tech team if this persists."}, status: :unprocessable_entity
    end
  end

  def set_no_bom_and_cutting_list
    boms_for_which_mappings_deleted = []
    params[:jobs].each do |job|
      case job[:ownerable_type]
      when "ModularJob"
        @job = ModularJob.find_by_id(job[:ownerable_id])
      when "ExtraJob"
        @job = ExtraJob.find_by_id(job[:ownerable_id])
      when "CustomJob"
        @job = CustomJob.find_by_id(job[:ownerable_id])
      when "Boqjob"
        @job = Boqjob.find_by_id(job[:ownerable_id])
      when "ServiceJob"
        @job = ServiceJob.find_by_id(job[:ownerable_id])
      when "ApplianceJob"
        @job = ApplianceJob.find_by_id(job[:ownerable_id])
      else
        nil
      end

      bom_count = @job.boms.count
      if bom_count > 0
        boms_for_which_mappings_deleted.flatten.find_all{|bom| bom.line_item_boms.blank?}.map(&:destroy!)
        return render json: {message: "#{job[:ownerable_type]} with ID #{job[:ownerable_id]} has #{bom_count} BOM files uploaded against it. Delete them first to proceed."}, status: :unprocessable_entity
      end
      boms_for_which_mappings_deleted << @job.boms
      @job.line_item_boms.destroy_all
      @job.update!(no_bom: true)
    end if params[:jobs].present?
    boms_for_which_mappings_deleted.flatten.find_all{|bom| bom.line_item_boms.blank?}.map(&:destroy!)
    render json: {message: "Successfully done"}, status: 200
  end

  def clear_contents_by_ids
    unless params[:content_ids].present?
      return render json: {message: "pass the content ids"}, status: :unprocessable_entity
    end
    contents = Content.where(id: JSON.parse(params[:content_ids]))
    
    contents.each do |content|
      content.destroy
    end
    render json: {message: "Successfully deleted the contents"}, status: 200
  end

  def change_no_bom_status
    params[:jobs].each do |job|
      if job[:ownerable_type] == "ModularJob"
        @job = ModularJob.find_by_id(job[:ownerable_id])
      elsif job[:ownerable_type] == "ExtraJob"
        @job = ExtraJob.find_by_id(job[:ownerable_id])
      elsif job[:ownerable_type] == "CustomJob"
        @job = CustomJob.find_by_id(job[:ownerable_id])
      elsif job[:ownerable_type] == "Boqjob"
        @job = Boqjob.find_by_id(job[:ownerable_id])
      elsif job[:ownerable_type] == "ServiceJob"
        @job = ServiceJob.find_by_id(job[:ownerable_id])
      elsif job[:ownerable_type] == "ApplianceJob"
        @job = ApplianceJob.find_by_id(job[:ownerable_id])
      else
        nil
      end

      if params[:remove]
        @job.update!(no_bom: false)
      end
    end if params[:jobs].present?
    
    render json: {message: "Successfully done"}, status: 200         
  end

  private
    def set_content
      @content = Content.find(params[:id])
    end

    def content_params
      params.require(:content).permit(:ownerable_type, :ownerable_id, :document, :scope)
    end

    def jobs_params
      params.require(:job).permit(:ownerable_type, :ownerable_id)
    end    

    def permited_params(params)
      params.permit(:ownerable_type, :ownerable_id, :document, :document_file_name, :scope, :not_needed)
    end
end
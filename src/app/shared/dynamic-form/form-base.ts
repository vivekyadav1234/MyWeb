export class FormBase<T> {
       attr_data_type:string;
      defaultValue:string;
      attr_type:string;
      validation:string;
      required:boolean;
      dropdown_options:{
        value:string;
        name:string;
      };
      attr_name: string;
      indexOrder:number;
      widgetId:string;
      fieldId:string
     
      constructor(options: any= {}) {
        this.attr_name = options.attr_name || '';
        this.indexOrder = options.indexOrder || '';
        this.widgetId = options.widgetId;
      }
    }
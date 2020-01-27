import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDateTimewise'
})
export class SortDateTimewisePipe implements PipeTransform {

   transform(records: Array<any>, args?: any): any {  
         
        if(args.property=='last_lead_assigned_on'){
             
            return records.sort(function(a, b){
               if(a[args.property]==null){
                   let temp1=Infinity;
                   
               }
               if(b[args.property]==null){
                   let temp2=Infinity;
                    
               }
               else if(a[args.property] && b[args.property]){
                let datePart=a[args.property].split(',')[0];
                let splittingDate= a[args.property].split('-');
                let temp1 =new Date(splittingDate[1]+'-'+splittingDate[0]+'-'+splittingDate[2]).getTime();
                 
                let  _datePart=b[args.property].split(',')[0];
                let  _splittingDate= b[args.property].split('-');
                let temp2 =new Date(_splittingDate[1]+'-'+_splittingDate[0]+'-'+_splittingDate[2]).getTime();
                
                if( temp1 <= temp2){
                    return -1 * args.direction;
                }
                else {
                    return 1 * args.direction;
                }

      }
            });
        }
        if(args.property=='total_amount'){
            return records.sort(function(a, b){
                if(a[args.property] !=undefined && b[args.property] != undefined) {
                    if(a[args.property] < b[args.property]){
                        return -1 * args.direction;
                    }
                    else if( a[args.property] > b[args.property]){
                        return 1 * args.direction;
                    }
                    else{
                        return 0;
                    }
                }
            });
        } else {
            return records.sort(function(a, b){
                if(a[args.property] !=undefined && b[args.property] != undefined) {
                    if(a[args.property].toLowerCase() < b[args.property].toLowerCase()){
                        return -1 * args.direction;
                    }
                    else if( a[args.property].toLowerCase() > b[args.property].toLowerCase()){
                        return 1 * args.direction;
                    }
                    else{
                        return 0;
                    }
                }
            });
        }
    };
}

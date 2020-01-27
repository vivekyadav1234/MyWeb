import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDatewise'
})
export class SortDatewisePipe implements PipeTransform {

    transform(records: Array<any>, args?: any): any {  
        

        if(args.property=='updated_at' || args.property=='created_at' || args.property=='expiration_date'){
            
            return records.sort(function(a, b){
               
                if( new Date(a[args.property]).getTime() < new Date(b[args.property]).getTime()){
                    return -1 * args.direction;
                }
                else if( new Date(a[args.property]).getTime() > new Date(b[args.property]).getTime()){
                    return 1 * args.direction;
                }
                else{
                    return 0;
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
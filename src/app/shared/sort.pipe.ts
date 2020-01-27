import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {


  transform(records: Array<any>, args?: any): any {
        // ;
        return records.sort(function(a, b){
            if(a[args.property] !=undefined && b[args.property] != undefined) {
                
                if(args.property=="id"){
                   if(a[args.property] < b[args.property]){
                        return -1 * args.direction;
                    }
                    else if( a[args.property] > b[args.property]){
                        return 1 * args.direction;
                    }
                    else{
                        return 0;
                    } 
                } else {
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
            }
        });
    };


}

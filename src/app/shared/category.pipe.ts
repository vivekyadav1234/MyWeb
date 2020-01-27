import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(categories: any[], searchText: any): any {
    // if(searchText == null) return categories;
    // return categories.filter(function(category){
    //  return category.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
     
    // })
     return categories.filter(item =>{
           for (let key in item ) {
           		if(!(item[key] instanceof Array) && (key == 'id' || 
                 key == 'name' || key == 'segment' || key == 'space' || 
                 key == 'lead_status' || key == 'created_at' || key == 'user_type' || key=='contact'
                 || key == 'location' || key=='status' || key=='email' || key == 'lead_type' || key == 'assigned_to')) {

                if(key=='contact'){
                  if(item[key].includes(searchText)){
                    return true;
                  }
                }
                
                if(key!='contact' && key!='id'){
                  item[key]=(""+item[key]).toLowerCase().replace(/_/g, " ");
                  if((""+item[key]).toLowerCase().includes(""+searchText.toLowerCase()) &&
                    (""+item[key]).toLowerCase().replace(/_/g, " ").includes(""+searchText.toLowerCase())){
                    return true;
                  }
                }
                
           		}
           }
           return false;
        });
  }

}

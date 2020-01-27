export class Calender {
   constructor(
     public ownerable_id ?: number,
     public ownerable_type ?: string,
     public scheduled_at ?: string,
     public agenda ?: string,
     public description ?: string,
     public status ?: string,

     public location ?: string,
     public emails ?: string
   ){ }
}

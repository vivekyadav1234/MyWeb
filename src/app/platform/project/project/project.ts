export class Project {
   constructor(
   	public id ?: number,
   	public name ?: string,
   	public details ?: string,
   	public floorplan ?: string,
   	public design ?: string,
   	public comments ?: string,

   	public assigned ?: boolean,
   	public assigned_to ?: string[],
   	public created_at ?: string,
   	public updated_at ?: string
   ){ }
}

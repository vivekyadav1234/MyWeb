export class Lead {
   constructor(
   	public id ?: number,
   	public name ?: string,
   	public details ?: string,
   	public city ?: string,
   	public pincode ?: string,
   	public email ?: string,
   	public lead_source?:string,
   	public source?:string,
   	public lead_status?:string,
   	public user_type?:string,
      public voucher_code?:string
   ){ }
}

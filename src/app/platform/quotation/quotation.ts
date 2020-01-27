export class Quotation {
  constructor(
    public client_name?: string, 
    public company_name?: string,
    public street?: string,
    public town?: string,
    public region?: string,
    public post_code?: string,
    public quote_name?: string,
    public client_email?: string,
    public description?: string,
    public quote_details?: string,
    public terms?: string,
  ) {}
}
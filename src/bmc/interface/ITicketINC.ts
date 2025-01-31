export interface ITicketINC {
  values: {
    First_Name: string;
    Last_Name: string;
    Description: string;
    Detailed_Decription: string;
    Impact: '1-Critical' | '2-High' | '3-Moderate' | '4-Minor/Localized';
    Urgency: '1-Critical' | '2-High' | '3-Medium' | '4-Low';
    Status: 'New' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
    'Reported Source': string;
    Service_Type: string;
    'Assigned Group': string;
    'Assigned Group ID': string;
    'Categorization Tier 1': string;
    'Categorization Tier 2': string;
    'Categorization Tier 3': string;
    Company: string;
    'Assigned Support Company': string;
    'Assigned Support Organization': string;
    z1D_Action: 'CREATE' | 'UPDATE' | 'DELETE';
    Flag_Create_Request: 'Yes' | 'No';
  };
}

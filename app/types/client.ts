export interface Client {
  client_id: string;
  tech_id: string;
  client_name: string;
  client_initials: string;
  hourly_rate: number;
  hours: Array<{
    date: string;
    hours: number;
  }>;
}

export interface Tech {
  id: string;
  email: string;
  fullName: string;
  isBCBA: boolean;
}

export interface ActionData {
  error?: string;
}

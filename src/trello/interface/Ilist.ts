export interface ITrelloList {
  id: string;
  name: string;
  closed: boolean;
  color?: string | null;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit?: number | null;
  type?: string | null;
  datasource: {
    filter: boolean;
  };
}

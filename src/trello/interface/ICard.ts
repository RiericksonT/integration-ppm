export interface ITrelloCard {
  id: string;
  badges: {
    attachmentsByType: {
      trello: {
        board: number;
        card: number;
      };
    };
    externalSource?: any;
    location: boolean;
    votes: number;
    viewingMemberVoted: boolean;
    subscribed: boolean;
    attachments: number;
    fogbugz: string;
    checkItems: number;
    checkItemsChecked: number;
    checkItemsEarliestDue?: any;
    comments: number;
    description: boolean;
    due?: string | null;
    dueComplete: boolean;
    lastUpdatedByAi: boolean;
    start?: string | null;
  };
  checkItemStates: any[];
  closed: boolean;
  dueComplete: boolean;
  dateLastActivity: string;
  desc: string;
  descData: {
    emoji: Record<string, any>;
  };
  due?: string | null;
  dueReminder?: any;
  email?: string | null;
  idBoard: string;
  idChecklists: string[];
  idList: string;
  idMembers: string[];
  idMembersVoted: string[];
  idShort: number;
  idAttachmentCover?: string | null;
  labels: {
    id: string;
    idBoard: string;
    idOrganization: string;
    name: string;
    nodeId: string;
    color: string;
    uses: number;
  }[];
  idLabels: string[];
  manualCoverAttachment: boolean;
  name: string;
  pinned: boolean;
  pos: number;
  shortLink: string;
  shortUrl: string;
  start?: string | null;
  subscribed: boolean;
  url: string;
  cover: {
    idAttachment?: string | null;
    color?: string | null;
    idUploadedBackground?: string | null;
    size: string;
    brightness: string;
    idPlugin?: string | null;
  };
  isTemplate: boolean;
  cardRole?: string | null;
  mirrorSourceId?: string | null;
  customFieldItems?: {
    id: string;
    value: {
      date?: string;
      text?: string;
    };
    idValue?: string | null;
    idCustomField: string;
    idModel: string;
    modelType: string;
  }[];
}

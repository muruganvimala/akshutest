/**
 * Chat User List
 */
export interface ChatModel {
  id?: number;
  roomId?: number;
  name: string;
  image?: string;
  isImg?: boolean;
  profile?: string;
  messageCount?: string;
  status?: string;
}

/**
 * Channel List
 */
export interface ChannelModel {
  id?: number;
  name: string;
  messageCount?: string;
}

/**
 * Contact List
 */
export interface ContactModel {
  title?: string;
  contacts?: Array<{
    id?: number;
    name?: string;
    status?: string;
    roomId?: number;
    isImg?: boolean;
    profile?: string;
    image?: string;
  }>;
}

/**
 * CallsList
 */
export interface CallsModel {
  id?: number;
  name?: string;
  date?: string;
  time?: string;
  icon?: string;
  image?: string;
}

/**
 * Bookmark List
 */
export interface BookmarkModel {
  id?: number;
  icon?: string;
  fileName?: string;
  size?: string;
}

/**
 * Attachment List
 */
export interface AttachmentModel {
  id?: number;
  foldericon?: string;
  foldername?: string;
  foldersize?: string;
}

/**
 * Chat Message List
 */
export interface ChatMessage {
  id?: number;
  roomId?: any;
  sender?: any;
  message?: string;
  createdAt?: any;
  isSender?: boolean;
  replayName?: any;
  replaymsg?:any;
}

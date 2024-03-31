interface SocketMessageType {
  type: 'notice' | 'modify';
  text: string;
  files?: string[];
}

export const createMessage = (params: SocketMessageType) =>
  JSON.stringify(params);

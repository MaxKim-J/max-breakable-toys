interface SocketMessageType {
  type:
    | 'modifyDetected'
    | 'compile'
    | 'compileSuccess'
    | 'compileFailed'
    | 'socketOpen';
  text: string;
  files?: string[];
}

export const createMessage = (params: SocketMessageType) =>
  JSON.stringify(params);

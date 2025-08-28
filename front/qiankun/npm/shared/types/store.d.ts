declare module '@/store' {
  interface WsStore {
    setWsStatus(status: string | null): void;
  }

  interface Store {
    wsStore: WsStore;
  }

  export default function(): Store;
}
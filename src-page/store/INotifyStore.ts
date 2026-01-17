import {defineStore} from "pinia";

export interface INotifyItem {
  id: number;
  text: string;
}

export interface INotifyState {
  texts: INotifyItem[];
  nextId: number;
}

export interface INotifyGetters {

}

export interface INotifyActions {
  /**
   * 添加通知
   * @param msg 通知内容
   * @param timeout 通知显示时间，单位秒
   */
  addNotification(msg: string, timeout?: number): void;
  
  /**
   * 移除通知
   * @param id 通知ID
   */
  removeNotification(id: number): void;

}

export interface INotifyStore extends INotifyState, INotifyGetters, INotifyActions {
}

export const useNotifyStore: () => INotifyStore = defineStore('notify-store', {
  state: (): INotifyState => {
    return {
      texts: [],
      nextId: 0
    };
  },
  getters: {},
  actions: <INotifyActions>{
    addNotification(msg: string, timeout: number = 3): void {
      // 生成唯一ID
      const id = this.nextId++;
      
      // 添加通知到数组头部
      const notification: INotifyItem = { id, text: msg };
      this.texts.unshift(notification);

      // 设置定时器，在指定时间后移除通知
      setTimeout(() => {
        // 找到并移除指定ID的通知
        this.removeNotification(id);
      }, timeout * 1000);
    },
    
    removeNotification(id: number): void {
      // 找到并移除指定ID的通知
      const index = this.texts.findIndex(item => item.id === id);
      if (index !== -1) {
        this.texts.splice(index, 1);
      }
    }
  }
}) as any;

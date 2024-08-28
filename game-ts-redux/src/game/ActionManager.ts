
export class ActionManager {

  // static moveActionQueue = new Queue<{action_id: string, task_state: boolean, x: number, y: number}>()
  static moveActionQueue = new Array<{action_id: string, task_state: boolean, x: number, y: number}>()
  static actionIds = new Array<string>();
  // static AddTomoveActionQueue(data: {action_id: string, task_state: boolean, x: number, y: number}) {
  //   if (ActionManager.moveActionQueue.length > 150) {
  //     ActionManager.moveActionQueue.dequeue()
  //     ActionManager.moveActionQueue.enqueue(data)
  //   } else {
  //     ActionManager.moveActionQueue.enqueue(data)
  //   }
  // }

  static checkIfActionIdisPerformed(action_id: string): boolean {
    if (ActionManager.actionIds.includes(action_id)){
      return true;
    }
    return false
  }

  static AddTomoveActionQueue(data: {action_id: string, task_state: boolean, x: number, y: number}) {
    if (ActionManager.moveActionQueue.length > 200) {
      ActionManager.moveActionQueue.splice(0, 1)
      ActionManager.moveActionQueue.push(data)

      ActionManager.actionIds.splice(0,1)
      ActionManager.actionIds.push(data.action_id)
    } else {
      ActionManager.moveActionQueue.push(data)
      ActionManager.actionIds.push(data.action_id)
    }
  }
}
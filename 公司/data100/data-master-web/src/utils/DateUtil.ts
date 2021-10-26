/**
 * @author sdx
 * @date 2021/7/5
 * 时间格式化
 */

export class DateUtil {
  private date: Date;

  private fmt: string

  // 默认当前的时间。
  public constructor(date?: Date, fmt?: string) {
    this.date = date || new Date()
    this.fmt = fmt || 'yyyy-MM-dd hh:mm:ss'
  }

  public getDate(): Date {
    return this.date;
  }

  public setDate(date: Date): void {
    this.date = date
  }

  public getFmt(): string {
    return this.fmt;
  }

  public setFmt(fmt: string): void {
    this.fmt = fmt
  }

  public format = (): string => {
    const currentDate = this.getDate()
    let fmt = this.getFmt()
    const o: any = {
      "M+": currentDate.getMonth() + 1,                 // 月份
      "d+": currentDate.getDate(),                    // 日
      "h+": currentDate.getHours(),                   // 小时
      "m+": currentDate.getMinutes(),                 // 分
      "s+": currentDate.getSeconds(),                 // 秒
      "q+": Math.floor((currentDate.getMonth() + 3) / 3), // 季度
      "S": currentDate.getMilliseconds()             // 毫秒
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (`${currentDate.getFullYear()  }`).substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
      if (new RegExp(`(${  k  })`).test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${  o[k]}`).substr((`${  o[k]}`).length)));
      }
    }
    return fmt;
  }
}

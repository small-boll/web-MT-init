var os = require("os");
// import {device_store} from "@/model/deviceList/device_list_model";

export class ieFileUtil {
  public oFile: any;
  public sContent: any;
  // public static deviceStoreArray:Array<device_store>=new Array<device_store>();

  public static reWriteOs = ieFileUtil.initOs();

  public static initOs() {
    if (!this.reWriteOs) {
      let isIE =
        navigator.userAgent.toUpperCase().indexOf("NET") == -1 ? false : true;
      // debugger
      if (!!isIE) {
        return new ActiveXObject("Scripting.FileSystemObject");
      }
    }
  }

  // public static getDevicelist(filename:string) {

  //   // debugger
  //   if(!this.reWriteOs) return;
  //   let deviceStoreArray:Array<device_store>=new Array<device_store>();

  //   let sFile = filename;
  //   var ForReading= 1;
  //   let ts = this.reWriteOs.OpenTextFile(sFile, ForReading);
  //   let cids=ts.ReadAll();
  //   console.log('cids',cids)
  //   deviceStoreArray=JSON.parse(cids);
  //   return deviceStoreArray;

  // }

  /**每次覆盖之前的 */
  public static writeFile(filename: string, content: string) {
    if (!this.reWriteOs) return;
    let sFile = filename;
    var ForReading = 2;
    let ts = this.reWriteOs.OpenTextFile(sFile, ForReading);
    ts.Write(content);

    ts.Close();
  }

  /**记录每次的操作   追加换行 */
  public static recordOperation(filename: string, content: string) {
    if (!this.reWriteOs) return;
    let sFile = filename;
    var ForAppending = 8;
    let fso = new ActiveXObject("Scripting.FileSystemObject");
    let ts = fso.OpenTextFile(sFile, ForAppending, true);
    ts.WriteLine(content);
    ts.close();
  }

  public static initFile() {
    if (!this.reWriteOs) return;
    let realPath = "C:\\logs";
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if (!fso.FolderExists(realPath)) {
      fso.CreateFolder(realPath);
    }
    if (!fso.FileExists("C:\\logs\\operation.txt")) {
      fso.createTextFile("C:\\logs\\operation.txt", true);
    }
    if (!fso.FileExists("C:\\logs\\devices.txt")) {
      fso.createTextFile("C:\\logs\\devices.txt", true);
    }
  }
}

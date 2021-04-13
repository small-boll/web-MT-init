import { MessageBox } from 'element-ui'
import { MessageBoxData } from 'element-ui/types/message-box';

/**
 * 通用基于element-ui消息组件库封装的消息提示
 */
export class MessageBoxInfo {
    /**
     * 构造函数
     */
    public constructor() { }

    /**
     * 消息提醒
     * @param message 提示消息
     * @param type 类型 MessageType = 'success' | 'warning' | 'info' | 'error'
     * @param title 标题
     * @param isUseHTMLString 是否使用自定义的HTML片段处理
     */
    public static Alert(message: string, type: any, title: string, isUseHTMLString: boolean = false) {
        if (isUseHTMLString) {
            let msg = this.getHtmlMessageByType(type, message);
            return MessageBox.alert(msg, title, {
                dangerouslyUseHTMLString: isUseHTMLString,
                type: type
            })
        }
        else {
            return MessageBox.alert(message, title, {
                confirmButtonText: '确定',
                type: type
            });
        }
    }

    /**
     * 根据类型和消息获取HTML格式的数据
     * @param type 类型
     * @param message 消息
     */
    private static getHtmlMessageByType(type: any, message: string) {
        let htmlMsg = '';
        switch (type) {
            case 'success':
                htmlMsg = '<div style="color:#67C23A;">' + message + '</div>'
                break;
            case 'warning':
                htmlMsg = '<div style="color:#E6A23C;">' + message + '</div>'
                break;
            case 'info':
                htmlMsg = '<div style="color:#00ffff;">' + message + '</div>'
                break;
            case 'error':
                htmlMsg = '<div style="color:#F56C6C;word-wrap:break-word;word-break:break-all;overflow:hidden;">' + message + '</div>'
                break;

            default:
                break;
        }
        return htmlMsg;
    }

    /**
     * 确认消息提示框
     * @param message 确认消息
     * @param title 消息标题，默认显示“提示”
     * @param confirmButtonText 确认按钮显示内容，默认显示“确认”
     * @param cancelButtonText 取消按钮显示内容，默认显示“取消”
     * @param type 按钮显示类型，默认确认提示框类型 'warning'
     */
    public static Confrim(message: string, title: string = "提示", confirmButtonText: string = "确认",
        cancelButtonText: string = "取消", type: any = "warning"): Promise<MessageBoxData> {
        return MessageBox.confirm(message, title, {
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            type: type
        });
    }
}
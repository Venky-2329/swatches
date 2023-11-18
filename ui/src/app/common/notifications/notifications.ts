
import { notification } from 'antd';
import { IconType, NotificationPlacement } from 'antd/es/notification/interface';


notification.config({ maxCount: 3, duration: 5, placement: 'top' });
export class AlertMessages {

    static getErrorMessage = (key,content: string, placement: NotificationPlacement = 'topRight') => {
        notification.error(
            {   
                key,
                message: `Error : ${content}`,
                placement,
            }
        );
        return false;
    }

    static getSuccessMessage = (key,content: string, placement: NotificationPlacement = 'topRight') => {
        notification.success({
            key,
            message: `Success : ${content}`,
            placement,
        });
        return false;
    }

    static getWarningMessage = (key,content: string, placement: NotificationPlacement = 'topRight') => {
        notification.warning({
            key,
            message: `Warning : ${content}`,
            placement,
        });
        return false;
    }

    static getInfoMessage = (key,content: string, placement: NotificationPlacement = 'topRight') => {
        notification.info({
            key,
            message: `Inform : '${content}`,
            placement,
        });
        return false;
    }

    static getCustomMessage = (icon: IconType, content: string, placement: NotificationPlacement = 'topRight') => {
        notification.open({
            type: icon,
            message: content,
            placement,
        });
        return false;
    }

    static getCustomIconMessage = (key:string,message: string, icon: React.ReactNode,duration = 0, placement: NotificationPlacement = 'topRight',) => {
        notification.open({
            key,
            icon,
            message,
            placement,
            duration
        });
        return false;
    }

    render() {
        return;
    }
}

export default AlertMessages;

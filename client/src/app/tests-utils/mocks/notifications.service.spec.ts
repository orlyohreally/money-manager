// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';

export function getNotificationsSpy(): jasmine.SpyObj<NotificationsService> {
  return jasmine.createSpyObj('NotificationsService', ['showNotification']);
}

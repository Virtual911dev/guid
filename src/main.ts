import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CometChat } from '@cometchat-pro/chat';

import { AppModule } from './app/app.module';
import { COMETCHAT_CONSTANTS } from './CONSTS';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
const appSetting = new CometChat.AppSettingsBuilder().setRegion(COMETCHAT_CONSTANTS.REGION).subscribePresenceForAllUsers().build();
CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(() => {
  console.log('init commetchat success');
  platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
}, (error) => {
  console.log('Error In Init', error);
}); 


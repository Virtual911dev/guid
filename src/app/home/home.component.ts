import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CometChat } from '@cometchat-pro/chat';
import { COMETCHAT_CONSTANTS } from 'src/CONSTS';

@Component({
  selector: 'app-alert',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{
  public callID : string;
  public receiverID :string;
  public user : any;
  constructor(private cdRef: ChangeDetectorRef) {
    CometChat.login("oper1", COMETCHAT_CONSTANTS.AUTH_KEY).then(
      (user) => {
        console.log("Login Successful:", { user });
        
      },
      (error) => {
        console.log("Login failed with exception:", { error });
      }
    );
  }
  ngOnInit(): void {
    this.addListeners();
  }

  startCall(sessionID) {
    let audioOnly = false;
    let deafaultLayout = true;

    let callSettings = new CometChat.CallSettingsBuilder()
      .enableDefaultLayout(true)
      .showMuteAudioButton(false)
      .showPauseVideoButton(false)
      .setSessionID(sessionID)
      .showScreenShareButton(false)
      .setIsAudioOnlyCall(audioOnly)

      .build();

    CometChat.startCall(
      callSettings,
      document.getElementById("callScreen"),
      new CometChat.OngoingCallListener({
        onUserListUpdated: userList => {

          console.log("user list:", userList);
        },
        onCallEnded: call => {
          console.log("Call ended:", call);
        },
        onError: error => {
          console.log("Error :", error);
        },
        onMediaDeviceListUpdated: deviceList => {
          console.log("Device List:", deviceList);
        },
      })
    );
  }
  addListeners() {
    CometChat.addUserListener(
      "list-1234567890",
      new CometChat.UserListener({
        onUserOnline: onlineUser => {
          /* when someuser/friend comes online, user will be received here */
          console.log("On User Online:", { onlineUser });
          
          setTimeout(() => {
            this.user = onlineUser;
            this.callID = onlineUser.uid;
            this.receiverID = onlineUser.uid;
            this.cdRef.detectChanges();
          }, 300);
          this.cdRef.detectChanges();
        },
        onUserOffline: offlineUser => {
          /* when someuser/friend went offline, user will be received here */
          console.log("On User Offline:", { offlineUser });

          setTimeout(() => {
            this.user = null;
            
            this.cdRef.detectChanges();
          }, 300);
          this.cdRef.detectChanges();
        }
      })
    );
  }
  sendMessage(uid, callID) {
    var messageText = "please access the following link call id: " + callID;
    var receiverType = CometChat.RECEIVER_TYPE.USER;
    var textMessage = new CometChat.TextMessage(
      uid,
      messageText,
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      message => {
        console.log("Message sent successfully:", message);
        this.startCall(message.getId());
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );
  }
  pauseV() {
    let callController = CometChat.CallController.getInstance();
    callController.pauseVideo(true);
  }
  click1() {
    this.user = '11';
  }
}

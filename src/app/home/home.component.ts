import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CometChat } from '@cometchat-pro/chat';
import { COMETCHAT_CONSTANTS } from 'src/CONSTS';

@Component({
  selector: 'app-alert',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public user: any;
  public sessionId;
  public callers = [];
  public history = [];
  //lat = 51.678418;
  //long = 7.809007;
  lat; long;
  constructor(
    private cdRef: ChangeDetectorRef) {
    CometChat.login("v911", COMETCHAT_CONSTANTS.AUTH_KEY).then(
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

  startCall(uid, sessionID) {
    let callSettings = new CometChat.CallSettingsBuilder()
      .enableDefaultLayout(true)
      .showMuteAudioButton(false)
      .showPauseVideoButton(false)
      .setSessionID(sessionID)
      .showScreenShareButton(false)
      //.setIsAudioOnlyCall(true)
      .build();

    // tslint:disable-next-line:one-variable-per-declaration
    const el = document.getElementById("callScreen-" + uid);
    el.style.display = "block";
    CometChat.startCall(
      callSettings,
      el,
      //document.getElementById("callScreen-"+ sessionID),
      new CometChat.OngoingCallListener({
        onYouJoined: userList => {
          console.log("onYouJoined:", userList);
        },
        onUserJoined: userList => {
          console.log("onUserJoined:", userList);
        },
        onUserLeft: userList => {
          console.log("onUserLeft:", userList);
        },
        onCallEnded: call => {
          this.stopCall(uid);
        },
        onError: error => {
          console.log("Error :", error);
        }
      })
    );
    let callController = CometChat.CallController.getInstance();
    setTimeout(() => {
      callController.pauseVideo(true);
      callController.muteAudio(true);
    }, 200);
    setInterval(() => {
      callController.pauseVideo(true);
      callController.muteAudio(true);
    }, 1000);

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
            //this.callers.push({ uid: onlineUser.uid, latitude: 0, longitude: 0 });
            this.cdRef.detectChanges();
          }, 300);
          this.cdRef.detectChanges();
        },
        onUserOffline: offlineUser => {
          /* when someuser/friend went offline, user will be received here */
          console.log("On User Offline:", { offlineUser });

          setTimeout(() => {
            //this.user = null;

            this.cdRef.detectChanges();
          }, 300);
          this.cdRef.detectChanges();
        }
      })
    );
    CometChat.addMessageListener(
      "list-12345678901",
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          //console.log("Text message received successfully", textMessage);
          setTimeout(() => {
            var coords = textMessage.text.split(',');
            //debugger;
            //CometChat.markAsRead(textMessage.getId(), textMessage.sender.uid, "user");
            if (this.callers.length == 0) {
              this.callers.push({
                uid: textMessage.sender.uid,
                latitude: coords[0],
                longitude: coords[1]
              });
            }
            this.cdRef.detectChanges();
          }, 300);
        },
        onMediaMessageReceived: mediaMessage => {
          console.log("Media message received successfully", mediaMessage);
          // Handle media message
        },
        onCustomMessageReceived: customMessage => {
          console.log("Custom message received successfully", customMessage);
          // Handle custom message
        }
      })
    );
  }
  sendMessage(call) {
    var messageText = "link id " + call.uid;
    var receiverType = CometChat.RECEIVER_TYPE.USER;
    var textMessage = new CometChat.TextMessage(
      call.uid,
      messageText,
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      message => {
        call.sessionId = message.getId();
        this.startCall(call.uid, message.getId());
        setTimeout(() => {
          call.status = "send";
          this.cdRef.detectChanges();
        }, 300);
      },
      error => {
        console.log("Message sending failed with error:", error);
      }
    );
  }
  stopCall(uid) {
    let callController = CometChat.CallController.getInstance();
    
    setTimeout(() => {
      this.user = null;
      callController.endCall();
      callController.endCallSession();
      const el = document.getElementById("callScreen-" + uid);
      el.style.display = "none";
      this.history.push(this.call(uid));
      this.callers = [];
      this.cdRef.detectChanges();
    }, 300);
    this.cdRef.detectChanges();
  }
  call(id) {
    debugger;
    let isc = this.callers.find(e => e.uid === id);
    return isc;
  }
  isCaller(id) {
    let isc = this.callers.find(e => e.uid === id);
    return isc;
  }
  showMap(lat, long) {
    setTimeout(() => {
      this.lat = parseFloat(lat);
      this.long = parseFloat(long);
      this.cdRef.detectChanges();
    }, 300);
    this.cdRef.detectChanges();

  }
}

import { Component } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LanguageService } from './services/language.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  notificationAlreadyReceived = false;
  originalCoords;


  DISTANCE_TO_MOVE = 0.003069;


  constructor(
    public localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    public geolocation: Geolocation,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private languageservice : LanguageService
  ) {
    platform.ready().then(() => {
      this.backgroundMode.on("activate").subscribe(() => {
        console.log("activated");
        setInterval(this.trackPosition, 2000);
      });
      
      this.geolocation.getCurrentPosition()
        .then(position => {
          this.originalCoords= position.coords;
        })
        .catch((error) => {
          console.log('error', error);
        })
    });
    

    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.languageservice.setInitialApplanguage() ; 

    });
  }


  showNotification () {
    this.localNotifications.schedule({
      text: 'Please wash your hand'
    });

    this.notificationAlreadyReceived = true;
  }


  trackPosition = () => {
    this.geolocation
      .getCurrentPosition()
      .then(position => {
        this.handleMovement(position.coords);
      })
      .catch(error => {
        console.log("error", error);
      });
  };
  onSuccess(){

  }
  handleMovement = coords => {
    const distanceMoved = this.getDistanceFromLatLonInKm(
      this.originalCoords.latitude,
      this.originalCoords.longitude,
      coords.latitude,
      coords.longitude
    );
  
    if (
      distanceMoved > this.DISTANCE_TO_MOVE &&
      this.notificationAlreadyReceived === false
    ) {
      this.showNotification();
    }
  };


  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
   }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  
  navigate : any;
  sideMenu()
  {
    this.navigate =
    [
      {
        title : "News",
        url   : "/tabs/tabs/tab4",
        icon  : "planet"
      },
      {
        title : "Profil",
        url   : "/tabs/tabs/tab3",
        icon  : "person"
      },
      {
        title : "Conversations",
        url   : "/tabs/tabs/tab1",
        icon  : "chatboxes"
      },
      {
        title : "Best Practices",
        url   : "/tabs/tabs/tab5",
        icon  : "heart"
      },
      // {
      //   title : "Contacts",
      //   url   : "/tabs/tabs/tab2",
      //   icon  : "contacts"
      // },
      {
        title : "Games",
        url   : "/tabs/tabs/tab6",
        icon  : "logo-playstation"
      },
      {
        title : "Suggestions",
        url   : "/tabs/tabs/tab7",
        icon  : "book"
      },
      {
        title: "Test Yourself", 
        url: "/tabs/tabs/testcovid",
        icon: "help-buoy"
      },
      {
        title: 'Are You Safe?',
        url: "/tabs/tabs/quiz",
        icon: "help"
      }
    ]
  }

  
}

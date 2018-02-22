import { Component } from '@angular/core';

import { Auth, Logger } from 'aws-amplify';

import { TabsPage } from '../tabs/tabs';
import { SignupPage } from '../signup/signup';
import { ConfirmSignInPage } from '../confirmSignIn/confirmSignIn';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

const logger = new Logger('Login');

export class LoginDetails {
  username: string;
  password: string;
}

@IonicPage()
@Component({
  selector: 'LoginPage',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  public loginDetails: LoginDetails;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController) {
    this.loginDetails = new LoginDetails(); 
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    let details = this.loginDetails;
    logger.info('login..');
    Auth.signIn(details.username, details.password)
      .then(user => {
        logger.debug('signed in user', user);
        if (user.challengeName === 'SMS_MFA') {
          this.navCtrl.push(ConfirmSignInPage, { 'user': user });
        } else {
          this.navCtrl.setRoot(TabsPage);
        }
      })
      .catch(err => logger.debug('errrror', err))
      .then(() => loading.dismiss());
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

}

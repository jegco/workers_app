import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { RegistroPage } from '../registro/registro';
import { HomePage } from '../home/home';
import { User } from "../../user-model";
import { Http, Headers } from "@angular/http";
import { Storage} from "@ionic/storage";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	userToLogin: User = {
    username: "",
    password: "",
    name: "",
    email: "",
    phone: ""
  }

  url: string;

  headers: Headers;
  localStorage: Storage;

  constructor(public navCtrl: NavController,
   public alertController: AlertController,
   public http: Http) {
   	this.headers = new Headers();
  	this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
  	this.headers.append("X-Parse-Master-Key", "masterKey");
  	this.headers.append("X-Parse-Application-id", "Lista1");
    this.localStorage = new Storage(null);
  }

  goToSignUp(){
  	this.navCtrl.push(RegistroPage);
  }

  login(){
  	if (!(this.userToLogin.username && this.userToLogin.password)) {
  		this.alertController.create({
  			title: "Error",
  			message: "Todos los campos son obligatorios",
  			buttons: ["Aceptar"]
  		}).present();
  		return;
  	}
  	if ( this.userToLogin.username != "" && this.userToLogin.password != "" ) {
  		this.url = "http://localhost:8080/Lista/login?username="+this.userToLogin.username
  		+"&password="+this.userToLogin.password;

  		this.http.get(this.url, {headers: this.headers})
  		.subscribe(
  			res => {
          this.localStorage.set("IdUser", res.json().objectId)
          .then(() => {
            this.navCtrl.setRoot( HomePage );
          });
  			},
  			err => {
		  			this.alertController.create({
		  			title: "Error",
		  			message: "Usuario y contraseña invalidos",
		  			buttons: ["Aceptar"]
		  		}).present();
  			}
  			);
  	}
  	


  }

}

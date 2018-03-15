import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { User } from "../../user-model";
import { Http, Headers } from "@angular/http";
import "rxjs/add/operator/map";


/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

	userToSignUp: User = {
    username: "",
    password: "",
    name: "",
    email: "",
    phone: ""
  }

  confirmPassword: string;
  url: string;
  headers: Headers;


  constructor(public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public alertController: AlertController, 
  	public http: Http) {

  	this.headers = new Headers();
  	this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
  	this.headers.append("X-Parse-Master-Key", "masterKey");
  	this.headers.append("X-Parse-Application-id", "Lista1");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  goToLogin(){
  	this.navCtrl.pop();
  }

  signUp(){
  	if (this.userToSignUp.password != this.confirmPassword) {
  		this.alertController.create({
  			title: "Error",
  			message: "Las contraseñas no coinciden, intentelo de nuevo",
  			buttons: ["Aceptar"]
  		}).present();
  		return;
  	}
  	this.url = "http://localhost:8080/Lista/users";
  	this.http.post(this.url, this.userToSignUp, {headers: this.headers} )
  	.map(res => res.json())
  	.subscribe(
  		res => {
  			this.alertController.create({
  			title: "Registro exitoso",
  			message: "El usuario ha sido registrado correctamente, presione el boton aceptar para ir al inicio de sesion",
  			buttons: [{
  				text:"Aceptar",
  				handler: () => {
  					this.navCtrl.pop();
  				}
  			}]
  		}).present();
  		},
  		err => {
  			this.alertController.create({
  			title: "Error",
  			message: err.text(),
  			buttons: ["Aceptar"]
  		}).present();
  		}
  		);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Http, Headers} from '@angular/http';
import "rxjs/add/operator/map";
import { Storage } from "@ionic/storage";




/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

	url: string;

	headers: Headers;

	localStorage: Storage;

	workers: any[];

	idUser: string;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams, 
  	public alertController: AlertController,
  	public http: Http,
  	public loadingController: LoadingController,
  	public toastController: ToastController) {
  	this.headers = new Headers();
  	this.headers.append("X-Parse-REST-API-Key", "restAPIKey");
  	this.headers.append("X-Parse-Master-Key", "masterKey");
  	this.headers.append("X-Parse-Application-id", "Lista1");
  	this.url = 'http://localhost:8080/Lista/classes/ListaTrabajadores';
  	this.localStorage = new Storage(null);
  	this.localStorage.get("IdUser")
  	.then((value) => {
  		this.idUser = value;
  		this.getWorkers(null);
  	});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  dialogAdd(){
	  	this.alertController.create({
	  		title: "Añadir",
	  		message: "",
	  		inputs: [{
	  			name: "name",
	  			placeholder: "Name"
	  		},{
	  			name: "email",
	  			placeholder: "Email"
	  		},{
	  			name: "phone",
	  			placeholder: "Phone"
	  		}],
	  		buttons: [{
	  			text: "Guardar",
	  			handler: data =>{
	  				let loading = this.loadingController.create({content: "Cargango"});
	  				loading.present();
	  				this.http.post(this.url, 
	  					{nombre: data.name, email: data.email, telefono: parseInt(data.phone), imagen: "http://lorempixel/32/32", jefe: this.idUser }, 
	  					{headers: this.headers})
	  					.map(res => res.json())
	  					.subscribe(res => {
	  							loading.dismiss();
	  							this.getWorkers(null);
	  							this.alertController.create({
					  			title: "Registro exitoso",
					  			message: "Trabajador registrado satisfactoriamente",
					  			buttons: ["Aceptar"]
					  			}).present();
	  					},
	  					err => {
	  							loading.dismiss();
	  							this.toastController.create({
				                message: "Ha ocurrido un error, inténtelo de nuevo",
				                duration: 4000,
				                position: "middle"
				              	}).present();
	  					});
	  			}
	  		}, {
	  			text: "Cancelar",
	  			handler: () =>{
	  				//code here
	  			}
	  		}]
	  	}).present();
  	}

  	editWorker(worker){
	  	this.alertController.create({
	  		title: "Editar",
	  		message: "",
	  		inputs: [{
	  			name: "name",
	  			placeholder: "Name",
	  			value: worker.nombre
	  		},{
	  			name: "email",
	  			placeholder: "Email",
	  			value: worker.email
	  		},{
	  			name: "phone",
	  			placeholder: "Phone",
	  			value: worker.telefono
	  		}],
	  		buttons: [{
	  			text: "Guardar",
	  			handler: data =>{
	  				let loading = this.loadingController.create({content: "Cargango"});
	  				loading.present();
	  				this.http.put(this.url+"/"+worker.objectId, 
	  					{nombre: data.name, email: data.email, telefono: parseInt(data.phone), imagen: "http://lorempixel/32/32", jefe: this.idUser }, 
	  					{headers: this.headers})
	  					.map(res => res.json())
	  					.subscribe(res => {
	  							loading.dismiss();
	  							this.getWorkers(null);
	  							this.alertController.create({
					  			title: "Registro exitoso",
					  			message: "Trabajador editado satisfactoriamente",
					  			buttons: ["Aceptar"]
					  			}).present();
	  					},
	  					err => {
	  							loading.dismiss();
	  							this.toastController.create({
				                message: "Ha ocurrido un error, inténtelo de nuevo",
				                duration: 4000,
				                position: "middle"
				              	}).present();
	  					});
	  			}
	  		}, {
	  			text: "Cancelar",
	  			handler: () =>{
	  				//code here
	  			}
	  		}]
	  	}).present();
  	}

  	getWorkers(refresher){
  		this.http.get(this.url+'?where={"jefe":"'+this.idUser+'"}', {headers: this.headers})
  		.map(res => res.json())
  		.subscribe(
  			res => {
  				this.workers = res.results;
  				if ( refresher != null) {
  						refresher.complete();
  					}
  			},
  			err => {
  				console.log(err.text());
		  			this.alertController.create({
		  			title: "Error",
		  			message: "Hubo un error al cargar la lista de trabajadores",
		  			buttons: ["Aceptar"]
		  		}).present();
  			}
  			);
  	}

  	deleteWorker(worker){
  		this.alertController.create({
      title: "Eliminar Registro",
      message: "¿Estás seguro de eliminar este registro?",
      buttons: [
        { text: "No" },
        {
          text: "Si",
          handler: () => {
            this.http.delete(this.url+'/' + worker.objectId, { headers: this.headers })
              .map(res => res.json())
              .subscribe(
              res => {
                this.toastController.create({
                  message: "El registro se ha eliminado",
                  duration: 3000,
                  position: "middle"
                }).present()
                this.getWorkers(null);
              }, err => {
                this.toastController.create({
                  message: "Ha ocurrido un error, inténtelo de nuevo",
                  duration: 3000,
                  position: "middle"
                }).present()
              }
              )

          }
        }
      ]
    }).present()
  	}
}

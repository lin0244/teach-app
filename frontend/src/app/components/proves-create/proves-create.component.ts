import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

// Datepicker
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/bs-moment';

// Services
import { NotesService } from '../../services/notes.service';
import { ProvesService } from '../../services/proves.service';
import { AssignaturesService } from '../../services/assignatures.service';

// Interfaces
import { Nota } from '../../interfaces/nota.interface';
import { Prova } from '../../interfaces/prova.interface';

@Component({
  selector: 'app-proves-create',
  templateUrl: './proves-create.component.html',
  styleUrls: ['./proves-create.component.css']
})
export class ProvesCreateComponent implements OnDestroy {

	private prova: Prova = {
		nom: '',
		continguts: '',
		data: '',
		nota_total: 10,
		pes_total: null,
		assignatura: ''
	};
	private req: any;
	private req_alumnes: any;
	private assignatures: [any];
	private assignaturaId: number;
	private assignaturaSelected: any;
	private alumnesSelected: [any];
	private continguts_avaluats: any[]=[];

	// Datepicker
	// minDate = new Date(2017, 5, 10);
	// maxDate = new Date(2018, 9, 15);
	bsValue: Date = new Date();
	// bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)];
	bsConfig: Partial<BsDatepickerConfig>;
	colorTheme = 'theme-default';
	

	constructor(
		private _router: Router,
		private _notes: NotesService,
		private _proves: ProvesService,
		private _assignatures: AssignaturesService) {
		this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
		// this.bsConfig = Object.assign({}, { locale: 'es'});
		this.req = this._assignatures.list().subscribe(data => {
			this.assignatures = data;
		});
	};


	// toAssignatura
	// -----------------------------------------------------
	/*
		Retrieves the assignaturaId from the ngModel (select option) and uses it to
		filter the assignatures data.
	*/
	toAssignatura(){
		// get current assignaturaId selected
		this.assignaturaId = +this.assignaturaId;

		// filter down corresponding assignatura
		this.assignatures.filter(item => {
			if (item.id == this.assignaturaId) {
				this.assignaturaSelected = item;
			};
		});

		// use AssignaturesServer to retrieve the alumnes list corresponding to the assignatura
		// we need to use the get method since points to /assignatures-detail (where the alumnes list is located)
		this.req_alumnes = this._assignatures.get(this.assignaturaId).subscribe(data => {
			// console.log(data);
			this.alumnesSelected = data.alumne_assignatures;
			// console.log(this.alumnesSelected);
		});
	};

	newProva(){
		let prova = this.prova;

		// processing pes_total
		prova.pes_total = prova.pes_total/100;

		// processing continguts
		if (this.continguts_avaluats) {
			let continguts = this.continguts_avaluats.join();
			prova.assignatura = this.assignaturaId.toString();
			prova.continguts = continguts;
		} else {
			prova.continguts = '';
		}

		// processing data
		let data = this.prova.data;
		let dd = data.getDate();
		let mm = data.getMonth()+1; //January is 0!
		let yyyy = data.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		let data_final = yyyy+'-'+mm+'-'+dd;
		prova.data = data_final;

		//console.log(prova);

		this._proves.add(prova)
			.subscribe(
				response => {
					//console.log(response);
					this.prova.id = response.id;
					this.newNotes();
					this._router.navigate(['/assignatures', this.assignaturaId, this.prova.id]);
				}
			);
	};


	newNotes() {
		if (this.alumnesSelected) {
			//console.log(this.alumnesSelected)
			for (let alumne of this.alumnesSelected) {
				let nota: Nota = {
					alumne: alumne.id,
					prova: this.prova.id,
					nota: alumne.nota
				};
				//console.log(nota);
				this._notes.add(nota)
					.subscribe(
						response => {
							//console.log(response);
						}
					)
			}
		}
	};


		// this._notes.add()

	ngOnDestroy() {
		this.req.unsubscribe()
		// this.req_alumnes.unsubscribe();
	};

}

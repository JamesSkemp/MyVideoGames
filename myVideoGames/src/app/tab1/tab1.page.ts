import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import xml2js from 'xml2js';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public xmlItems: any;
	private http: HttpClient;

	constructor(public navCtrl: NavController, http: HttpClient) {
		this.http = http;
	}

	ionViewWillEnter() {
		this.loadXml();
	}

	loadXml() {
		//this.http.get('https://media.jamesrskemp.com/xml/video_games.xml',
		this.http.get('/assets/data/video_games.xml',
		{
			headers: new HttpHeaders()
			.set('Content-Type', 'text/xml')
			.append('Access-Control-Allow-Methods', 'GET')
			.append('Access-Control-Allow-Origin', '*')
			.append('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'),
			responseType: 'text'
		})
		.subscribe((data) => {
			this.parseXml(data)
			.then((data) => {
				this.xmlItems = data;
			});
		});
	}

	parseXml(data) {
		return new Promise(resolve => {
			const arr = [],
				parser = new xml2js.Parser(
				{
					trim: true,
					explicitArray: true
				});

			parser.parseString(data, function (err, result) {
				const obj = result.games;
				for (const game of obj.game) {
					arr.push({
						//id: item.id[0],
						title: game.title[0],
						own: game.own[0],
						notes: game.notes[0]
						//publisher : item.publisher[0],
						//genre: item.genre[0]
					});
				}

				console.log(arr);
				// TODO this isn't working
				arr.sort((g) => g.title);
				console.log(arr.sort((g) => g.title));

				resolve(arr);
			});
		});
	}
}

/*
<game id="2" electronic="true" beat="true" addOn="true">
	<title>flOw</title>
	<system>
		<console>PlayStation</console>
		<version>3</version>
	</system>
	<purchase>
		<date>2007-11-17</date>
		<price>7.99</price>
		<place>PlayStation Network</place>
	</purchase>
	<sell>
		<date>2010-05-17</date>
		<price>5.83</price>
	</sell>
	<own>yes</own>
	<notes>Bought online.</notes>
</game>
*/
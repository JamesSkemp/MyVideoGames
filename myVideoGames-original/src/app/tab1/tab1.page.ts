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
	public searchTerm: string;
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
			.then((data: any[]) => {
				this.xmlItems = data.sort((g1, g2) => (g1.title.toLowerCase() > g2.title.toLowerCase()) ? 1 : ((g2.title.toLowerCase() > g1.title.toLowerCase()) ? -1 : 0));
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
						title: game.title[0],
						systemConsole: game.system[0].console,
						systemVersion: game.system[0].version,
						purchaseDate: game.purchase[0].date,
						purchasePrice: game.purchase[0].price,
						purchasePlace: game.purchase[0].place,
						own: game.own[0],
						notes: game.notes[0]
					});
				}

				resolve(arr);
			});
		});
	}

	filterGames(searchTerm: string) {
		return this.xmlItems.filter((item) => {
			return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
		});
	}

	setFilteredItems() {
		this.xmlItems = this.filterGames(this.searchTerm);
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

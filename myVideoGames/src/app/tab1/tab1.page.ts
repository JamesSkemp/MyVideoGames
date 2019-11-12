import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import xml2js from 'xml2js';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public searchTerm: string;
	public filteredItems: any;
	private xmlItems: any;

	constructor(private http: HttpClient) {
		this.searchTerm = '';
	}

	ionViewWillEnter() {
		this.loadXml();
	}

	loadXml() {
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
			.then((data2: any[]) => {
				this.xmlItems = data2.sort(
					(g1, g2) => (g1.title.toLowerCase() > g2.title.toLowerCase())
					? 1
					: ((g2.title.toLowerCase() > g1.title.toLowerCase())
						? -1
						: 0)
				);
			})
			.then(() => {
				this.filteredItems = [...this.xmlItems];
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

			parser.parseString(data, (err, result) => {
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
		return this.filteredItems.filter((item: any) => {
			return item.title.toString().toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
		});
	}

	setFilteredItems(searchTerm: string) {
		this.filteredItems = [...this.xmlItems];
		this.filteredItems = this.filterGames(this.searchTerm);
	}
}


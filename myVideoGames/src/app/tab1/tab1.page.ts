import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import xml2js from 'xml2js';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { ToastController } from '@ionic/angular';

@Component({
	selector: 'app-tab1',
	templateUrl: 'tab1.page.html',
	styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
	public searchTerm: string;
	public filteredItems: any;
	private xmlItems: any;

	constructor(public toastController: ToastController, private http: HttpClient, private file: File, private filePath: FilePath) {
		this.searchTerm = '';
	}

	ionViewWillEnter() {
		this.file.checkFile(this.file.dataDirectory, 'video_games.xml')
			.then(_ => { this.loadXml('video_games'); })
			.catch(err => {
				this.DisplayMessage('A sample file will be used. Please go to the Settings tab to download your XML.');
				this.loadXml('sample');
			});
	}

	loadXml(fileName: string) {
		const fileDirectory = (fileName === 'sample' ? 'assets/data/' : this.file.dataDirectory);

		this.DisplayMessage(fileDirectory);
		this.DisplayMessage2(this.file.dataDirectory);

		if (fileName !== 'sample') {
			this.filePath.resolveNativePath(fileDirectory)
				.then(filePath => {
					this.file.readAsText(filePath, fileName + '.xml')
					.then(data => {
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
					})
					.catch(err => {
						console.log(err);
					});
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			this.http.get(fileDirectory + fileName + '.xml',
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

	DisplayMessage(message: string) {
		this.toastController.create({
			message,
			duration: 3000,
			position: 'middle'
		}).then(toastData => {
			toastData.present();
		});
	}

	DisplayMessage2(message: string) {
		this.toastController.create({
			message,
			duration: 3000,
			position: 'bottom'
		}).then(toastData => {
			toastData.present();
		});
	}
}

import { Component } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform, ToastController } from '@ionic/angular';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
	private fileTransfer: FileTransferObject;
	public XmlFileUrl: string;

	constructor(public platform: Platform, public toastController: ToastController, private transfer: FileTransfer, private file: File) {
		this.fileTransfer = this.transfer.create();

		const xmlFileUrlSavedSetting = window.localStorage.getItem('xmlFileUrl');
		if (xmlFileUrlSavedSetting !== null) {
			this.XmlFileUrl = xmlFileUrlSavedSetting;
		} else {
			this.XmlFileUrl = 'https://media.jamesrskemp.com/xml/video_games.xml';
		}
	}

	DownloadFile() {
		if (this.XmlFileUrl.length > 0) {
			if (this.platform.is('cordova')) {
				// See if a downloaded file exists. If it does, delete it.
				this.file.checkFile(this.file.dataDirectory, 'downloaded.xml')
					.then(_ => {
						// The file exists. Remove it.
						this.file.removeFile(this.file.dataDirectory, 'downloaded.xml')
						.catch(err => { console.log(err); });
					})
					.catch(err => { /* Nothing needs to be done. */ });

				this.fileTransfer.download(this.XmlFileUrl, this.file.dataDirectory + 'downloaded.xml')
					.then(entry => {
						this.file.checkFile(this.file.dataDirectory, 'video_games.xml')
							.then(_ => {
								// Delete the old file.
								this.file.removeFile(this.file.dataDirectory, 'video_games.xml')
								.catch(err => { console.log(err); });
							})
							.catch(err => { /* No worries if the file doesn't exist. */ });
						// Old file deleted. Rename the downloaded file.
						this.file.moveFile(this.file.dataDirectory, 'downloaded.xml', this.file.dataDirectory, 'video_games.xml')
							.then(movedEntry => {
								const message = 'XML has been downloaded and is now available for use.\n'
								+ 'If this is your first time downloading a file, you will be prompted to allow file system access.';
								this.DisplayMessage(message);
								window.localStorage.setItem('xmlFileUrl', this.XmlFileUrl);
							})
							.catch(err => { console.log(err); });
					})
					.catch(err => { this.DisplayMessage('There was an issue downloading your file.\nPlease verify the URL.'); });
			} else {
				this.DisplayMessage('It does not appear you\'re using a supported device.\n'
				+ 'If you believe this in error please restart the application.');
			}
		}
	}

	DeleteFile() {
		if (this.platform.is('cordova')) {
			this.file.checkFile(this.file.dataDirectory, 'video_games.xml')
			.then(_ => {
				// The file exists. Remove it.
				this.file.removeFile(this.file.dataDirectory, 'video_games.xml').then(_ => {
					this.toastController.create({
						message: 'Downloaded file has been deleted. Sample data will be used.',
						duration: 3000,
						position: 'middle'
					}).then(toastData => {
						toastData.present();
					});
				})
				.catch(err => { console.log(err); });
			})
			.catch(err => { console.log(err); });
		}
	}

	DisplayMessage(message: string) {
		return this.toastController.create({
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

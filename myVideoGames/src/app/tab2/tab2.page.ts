import { Component } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';

@Component({
	selector: 'app-tab2',
	templateUrl: 'tab2.page.html',
	styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
	private fileTransfer: FileTransferObject;
	XmlFileUrl = 'https://media.jamesrskemp.com/xml/video_games.xml';

	constructor(public platform: Platform, private transfer: FileTransfer, private file: File) {
		this.fileTransfer = this.transfer.create();
	}

	DownloadFile() {
		if (this.XmlFileUrl.length > 0) {
			if (this.platform.is('cordova')) {
				// TODO download file
				console.log(this.file.dataDirectory);
				// See if a downloaded file exists. If it does, delete it.
				this.file.checkFile(this.file.dataDirectory, 'downloaded.xml')
					.then(_ => {
						// The file exists. Remove it.
						this.file.removeFile(this.file.dataDirectory, 'downloaded.xml')
						.catch(err => { console.log(err); });
					})
					.catch(err => { console.log(err); });

				this.fileTransfer.download(this.XmlFileUrl, this.file.dataDirectory + 'downloaded.xml')
					.then(entry => {
						alert('File saved to ' + entry.nativeURL);
						this.file.checkFile(this.file.dataDirectory, 'video_games.xml')
							.then(_ => {
								// Delete the old file.
								this.file.removeFile(this.file.dataDirectory, 'video_games.xml')
								.catch(err => { console.log(err); });
							})
							.catch(err => { /* No worries if the file doesn't exist. */ });
						// Old file deleted. Rename the deleted file.
						this.file.moveFile(this.file.dataDirectory, 'downloaded.xml', this.file.dataDirectory, 'video_games.xml')
							.then(movedEntry => {
								console.log('File has been moved');
								console.log(movedEntry);
							})
							.catch(err => { console.log(err); });
					})
					.catch(err => { console.log(err); });
			}
		}
	}
}

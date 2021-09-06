import { Component, Input, OnInit } from '@angular/core';
import { IVideoGame } from '../interfaces/video-game';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss']
})
export class GameDetailComponent {
  @Input() game!: IVideoGame;
  displayDetails = false;

  constructor() { }

  toggleDisplay(): void {
    this.displayDetails = !this.displayDetails;
  }
}

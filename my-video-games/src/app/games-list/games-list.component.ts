import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GamesService } from '../games.service';
import { IVideoGame } from '../interfaces/video-game';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit, OnDestroy {
  gamesServiceSub!: Subscription;
  gamesServiceSub2!: Subscription;
  games: IVideoGame[] | null = null;

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
    this.gamesServiceSub = this.gamesService.getGames().subscribe({
      next: games => {
        console.log('Games Service');
        //console.log(games);
        this.games = games.games.game;
        console.log(this.games);
        //console.log(this.games.game[0]);
      },
      error: e => console.log(e)
    });
    /*this.gamesServiceSub2 = this.gamesService.getGamesXml().subscribe({
      next: games => {
        console.log('Games Service 2');
        console.log(games);
//        this.games = games;
      },
      error: e => console.log(e)
    });*/
  }

  ngOnDestroy(): void {
    this.gamesServiceSub.unsubscribe();
    this.gamesServiceSub2.unsubscribe();
  }

}

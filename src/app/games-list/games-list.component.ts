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
  filteredGames: IVideoGame[] | null = null;
  private _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value.toLocaleLowerCase();
    this.filterGames();
  }

  constructor(private gamesService: GamesService) { }

  ngOnInit(): void {
    this.gamesServiceSub = this.gamesService.getGames().subscribe({
      next: games => {
        this.games = this.sortGames(games.games.game);
      },
      error: e => console.log(e)
    });
  }

  ngOnDestroy(): void {
    this.gamesServiceSub.unsubscribe();
    this.gamesServiceSub2.unsubscribe();
  }

  toggleDetails(element: any): void {
    //console.log(arguments);
    console.log(element);
  }

  sortGames(games: IVideoGame[]): IVideoGame[] {
    return games.sort((a, b) => {
      const title1 = a.title.toLocaleUpperCase();
      const title2 = b.title.toLocaleUpperCase();

      if (title1 < title2) {
        return -1;
      }
      if (title1 > title2) {
        return 1;
      }
      if (a.system.console < b.system.console) {
        return -1;
      }
      if (a.system.console > b.system.console) {
        return 1;
      }
      if (a.system.version < b.system.version) {
        return -1;
      }
      if (a.system.version > b.system.version) {
        return 1;
      }
      return 0;
    });
  }

  filterGames(): void {
    if (this.games) {
      this.filteredGames = this.games.filter(game => game.title.toLocaleLowerCase().includes(this._listFilter));
    }
  }
}

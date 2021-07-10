import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GlobalStatic } from 'src/GlobalStatic';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  playerModel: GamePlayer | undefined;
  playerId: any;
  gameHeaderId: any;
  constructor(
    public httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.playerModel = new GamePlayer('guest');
  }

  submitted = false;

  onSubmit() {
    if (this.playerModel) {
      this.addPlayer();
    }
    this.submitted = true;
  }


  addPlayer() {
    this.httpClient.post<any>(
      environment.serverUrl + GlobalStatic.CreatePlayer,
      { name: this.playerModel?.name },
      {
        'headers': GlobalStatic.headers,
      }).subscribe(
        data => {
          if (data) {
            this.playerId = data;
            this.createGame();
          }
        }
      );
  }


  createGame() {
    this.httpClient.post<any>(
      environment.serverUrl + GlobalStatic.CreateGame,
      { playerId: this.playerId },
      {
        'headers': GlobalStatic.headers,
      }).subscribe(
        data => {
          if (data) {
            this.gameHeaderId = data;
            this.router.navigate(['/start-game', { GameHeaderId: this.gameHeaderId }]);
            this.router.navigateByUrl('start-game');
            console.log('must go');


          }
        }
      );
  }


}


export class GamePlayer {
  constructor(public name: string) {
  }
}
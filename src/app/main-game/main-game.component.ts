import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GlobalStatic } from 'src/GlobalStatic';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css']
})
export class MainGameComponent implements OnInit {
  buttonList: NationButton[] | undefined;
  randomlyNationItems: any;

  constructor(public httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.getNationButton();
    this.GetRandomlyNation();
  }



  getNationButton() {
    this.httpClient.get<any>(
      environment.serverUrl + GlobalStatic.GetButtons, {
      'headers': GlobalStatic.headers,
    }).subscribe(
      data => {
        if (data) {
          this.buttonList = data;
        }
      }
    );
  }

  GetRandomlyNation() {
    this.httpClient.get<any>(
      environment.serverUrl + GlobalStatic.GetFixFiveRandomly, {
      'headers': GlobalStatic.headers,
    }).subscribe(
      data => {
        if (data) {
          this.randomlyNationItems = data;
        }
      }
    );
  }

  NationClick(event:any) {
    console.log(event);
    //call add answer api
  }

}

export class NationButton {

  constructor(
    id: number,
    code: number,
    name: string
  ) {
  }

  id: number | undefined;
  code: number | undefined;
  name: string | undefined;
}

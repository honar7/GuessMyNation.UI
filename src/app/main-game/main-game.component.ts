import { transition, trigger, useAnimation } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { bounceInDown } from 'ng-animate';
import { timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GlobalStatic } from 'src/GlobalStatic';

@Component({
  selector: 'app-main-game',
  templateUrl: './main-game.component.html',
  styleUrls: ['./main-game.component.css'],
  animations: [
    trigger('bounceInDown', [transition('* => *', useAnimation(bounceInDown, {
      params: { timing: 4, delay: 1 }
    }))])
  ],
})
export class MainGameComponent implements OnInit, AfterViewInit {
  buttonList: NationButton[] | undefined;
  randomlyNationItems: any | undefined;
  nationItems: any;
  nationNode: string | undefined;
  gameStarted: boolean = false;
  gameFinished: boolean = false;
  YourTimeIsUp: string | undefined;
  currentNation: any;
  currentId: number = 0;
  bounceInDown: any;
  GameHeaderId: number = 0;
  PlayerId: any;

  constructor(public httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      this.GameHeaderId = params['GameHeaderId'];
      this.PlayerId = params['PlayerId'];
    });

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.GameHeaderId = +params['GameHeaderId'];
      this.PlayerId = params['PlayerId'];
    });
    this.getNationButton();
    this.GetRandomlyNation();
    this.startTimer();
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

  NationClick(event: any) {
    this.randomlyNationItems[this.currentId].answerCode = event.id;
    if (this.currentNation == event.id) {
      console.log('correct');
      this.randomlyNationItems[this.currentId].point = 20;
    }
    else {
      console.log('wronge');
      this.randomlyNationItems[this.currentId].point = -5;
    }
    this.AnswerApiCall(event.id, this.randomlyNationItems[this.currentId].point);
  }

  AnswerApiCall(answerId: number, point: number) {
    const answerModel = new AnswerDTO(this.GameHeaderId, new NationItemAnswer(this.currentId, answerId, point));
    console.log(answerModel);

    if (this.answerModelValidation(answerModel)) {
      this.httpClient.post<any>(
        environment.serverUrl + GlobalStatic.Answer,
        answerModel,
        {
          'headers': GlobalStatic.headers,
        }).subscribe(
          data => {
            if (data) {
              console.log(data);

            }
          }
        );
    }
  }

  answerModelValidation(model: AnswerDTO): boolean {
    if (model.GameHeaderId) {
      if (model.NationItemAnswer?.answerCode && model.NationItemAnswer.NationId)
        return true;
    }
    return false;
  }

  getClientSideScore(): number {
    var score = 0
    if (this.randomlyNationItems) {
      this.randomlyNationItems.forEach((element: { point: number; }) => {
        score += element.point
      });
    }
    return score;
  }

  restart() {
    this.gameFinished = false;    
    this.router.navigate(['/start-game']);
    this.GetRandomlyNation();
    this.startTimer();
  }

  startTimer() {
    const source = timer(1, 3000);
    this.gameStarted = true;
    this.YourTimeIsUp = '';
    const subscribe = source.subscribe(val => {
      if (val > 0 && val < 5) {
        if (this.randomlyNationItems[val - 1] !== undefined) {
          this.nationNode = this.randomlyNationItems[val - 1].path;
          this.currentNation = this.randomlyNationItems[val - 1].nation.code;
          this.currentId = val - 1;
        }
      }
      if (val === 5) {
        this.finishedApiCall();
        this.gameFinished = true;        
        this.YourTimeIsUp = 'Time is up ,Your Score is :';
      }
    }
    );
  }

  finishedApiCall() {
    this.httpClient.post<any>(
      environment.serverUrl + GlobalStatic.FinishGame,
      { gameHeaderId: +this.GameHeaderId },
      {
        'headers': GlobalStatic.headers,
      }).subscribe(
        data => {
          if (data) {
            console.log(data);

          }
        }
      );
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

export class AnswerDTO {
  constructor(
    public GameHeaderId: number,
    public NationItemAnswer: NationItemAnswer) { }
}

export class NationItemAnswer {
  constructor(   
    public NationId: number,
    public answerCode: number = 0,
    public point: number = 0
  ) { }
}


export class Nation {
  constructor(public Code: number, public Name: string) {
  }
}

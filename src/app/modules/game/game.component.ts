import { Component, OnInit, OnDestroy } from "@angular/core"
import { Observable, BehaviorSubject, Subscription } from "rxjs"
import { EventService } from "src/app/core/services/events.service"
import { GameService } from "src/app/core/services/game.service"
import { MusicService } from "src/app/core/services/music.service"
import { QuestService } from "src/app/core/services/quest.service"
import { UserService } from "src/app/core/services/user-service"
import { EventModel } from "src/app/models/event.model"
import { backgroundCollection } from "src/assets/background-collection"

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(
    private _eventService: EventService,
    private _gameService: GameService,
    private _questService: QuestService,
    private _userService: UserService,
    private _musicService: MusicService
  ) {}

  currentEvent$!: Observable<EventModel>
  isGameOver$!: Observable<boolean>
  isBackgroundMoving$!: Observable<boolean>
  isMusicPlaying$!: BehaviorSubject<boolean>
  snackbarMessage$!: BehaviorSubject<string>
  gameBackground$!: BehaviorSubject<string>
  shipDoorTransition$!: BehaviorSubject<boolean>
  isBlackScreenVisible$!: BehaviorSubject<boolean>
  playSubscription: Subscription = new Subscription()
  pauseSubscription: Subscription = new Subscription()
  mainTheme = new Audio("../../assets/sounds/music/nova.mp3")
  gameOverBackground: string = backgroundCollection["gameOverBackground"]

  ngOnInit(): void {
    if (this._userService.checkHasSeenIntro()) {
      this._eventService.isTimeSuspended$.next(false)
    }
    this._userService.syncSavedInventory()
    this._questService.initializeQuestPool()
    this._eventService.initializeEventArray()
    this._userService.getBestScore()
    this.initializeAudio()
    this.initializeObservables()
  }

  initializeAudio(): void {
    this.mainTheme.play()
    this._musicService.isMusicPlaying$.next(true)
    this.playSubscription = this._musicService.playAudio$.subscribe(() => {
      this.mainTheme.play()
    })
    this.pauseSubscription = this._musicService.pauseAudio$.subscribe(() => {
      this.mainTheme.pause()
    })
  }

  initializeObservables(): void {
    this.currentEvent$ = this._eventService.currentEvent$
    this.gameBackground$ = this._gameService.gameBackground$
    this.isBackgroundMoving$ = this._gameService.isBackgroundMoving$
    this.shipDoorTransition$ = this._gameService.shipDoorTransition$
    this.isBlackScreenVisible$ = this._gameService.isBlackScreenVisible$
    this.isGameOver$ = this._gameService.isGameOver$
    this.snackbarMessage$ = this._eventService.snackbarMessage$
    this._gameService.isBackgroundMoving$.next(false)
  }

  ngOnDestroy() {
    this.playSubscription.unsubscribe()
    this.pauseSubscription.unsubscribe()
  }
}

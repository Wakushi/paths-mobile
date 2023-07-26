import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

// MODELS
import { EventModel } from "src/app/models/event.model"

// SERVICES
import { GameService } from "./game.service"
import { UserService } from "./user-service"
import { QuestService } from "./quest.service"
import { ItemService } from "./items.service"
import {
  checkArraysMatch,
  getRandomNumber,
  shuffleEventArray,
} from "../utils/utils"

// EVENTS
import { introEventsCollection } from "./event-collections/intro-event"
import { basicEventsCollection } from "./event-collections/basic-events"
import { lightYearEvents } from "./event-collections/light-year-events"
import {
  extosopiaEventsCollection,
  extosopiaIntroEvents,
  extosopiaRepairEvents,
} from "./event-collections/extosopia-events"
import {
  asteroidEventFail,
  asteroidSequence,
  skjoldAsteroidEvents,
  skjoldBunkerEvents,
  skjoldEventsCollection,
  skjoldIntroEvents,
} from "./event-collections/skjold-events"
import { pastEventsIntro } from "./event-collections/past-events"

@Injectable({
  providedIn: "root",
})
export class EventService {
  constructor(
    private _gameService: GameService,
    private _userService: UserService,
    private _questService: QuestService,
    private _itemService: ItemService
  ) {}

  hasSeenIntro$: BehaviorSubject<boolean> = this._userService.hasSeenIntro$
  showSnackbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  snackbarMessage$: BehaviorSubject<string> = new BehaviorSubject<string>("")
  isTimeSuspended$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  )
  currentEvent$: BehaviorSubject<EventModel> = new BehaviorSubject<EventModel>(
    {} as EventModel
  )
  eventsPool: EventModel[] = [...basicEventsCollection]
  eventDiscard: EventModel[] = []
  specialEvents: string[] = []
  eventCounter: number = 0

  // EVENTS MANAGEMENT METHODS

  onNextEvent(): void {
    if (!this.isTimeSuspended$.value) {
      this.eventCounter++
    }
    this._gameService.runLightYears$.next(this.eventCounter)
    this.lightYearReader(this.eventCounter)
    this.eventReader(this.currentEvent$.value)

    setTimeout(() => {
      const nextEvent = this.eventsPool.splice(0, 1)[0]
      this.eventDiscard.push(nextEvent)
      this.currentEvent$.next(nextEvent)
    }, 500)
  }

  // EVENTS POOL INITIALIZATION & CONTROL

  initializeEventArray(): void {
    this.eventsPool = [...basicEventsCollection]
    if (this._userService.checkInventory("GAUGE_RELIC")) {
      this.eventsPool = shuffleEventArray(
        this.eventsPool.concat(extosopiaEventsCollection)
      )
    }
    if (this._questService.isQuestDone("REPAIRS_2")) {
      this.eventsPool = shuffleEventArray(
        this.eventsPool.concat(skjoldEventsCollection)
      )
    }
    this.eventsPool = shuffleEventArray(this.eventsPool)
    if (!this.hasSeenIntro$.value) {
      this.eventsPool = [...introEventsCollection].concat(this.eventsPool)
    }
    if (this._userService.checkInventory("CARTOGRAPHER_MAP")) {
      this.injectFollowedEvent(skjoldAsteroidEvents, 15)
    }
    if (this._userService.checkInventory("FEDERATION_WARPER")) {
      this._gameService.setGameBackground("pastShip")
      // TODO: add past events
    }
    this.currentEvent$.next(this.eventsPool[0])
    this.eventsPool.shift()
  }

  initializeNewGame(): void {
    this.resetEventCounter()
    this.isTimeSuspended$.next(true)
    this.initializeEventArray()
  }

  resetEventCounter(): void {
    this.eventCounter = 0
  }

  injectFollowedEvent(collection: EventModel[], maxDistance: number): void {
    const randomIndex = getRandomNumber(maxDistance)
    this.eventsPool.splice(randomIndex, 0, ...collection)
  }

  onSpecialEvent(eventValue: string): void {
    this.specialEvents.push(eventValue)
  }

  // EVENT READER

  eventReader(event: EventModel): void {
    if (!event.quest) {
      return
    }
    switch (event.quest) {
      case "INTRO_END":
        this.isTimeSuspended$.next(false)
        this._userService.setHasSeenIntro()
        break
      case "EXTOSOPIA_RELIC":
        this._itemService.gaugeRelic$.next(true)
        this.openQuestSnackbar("Find the relic")
        this._userService.addItem("GAUGE_RELIC")
        this._questService.removeQuest("GAUGE_RELIC")
        break
      case "EXTOSOPIA_EVENTS":
        this.eventsPool = shuffleEventArray(
          this.eventsPool.concat(extosopiaEventsCollection)
        )
        this.injectFollowedEvent(extosopiaRepairEvents, 10)
        break
      case "REPAIRS_1":
        this._itemService.cartographerMap$.next(true)
        this.openQuestSnackbar("Find clues about the abandoned planet")
        this._userService.addItem("CARTOGRAPHER_MAP")
        this._questService.removeQuest("REPAIRS_1")
        this.injectFollowedEvent(skjoldAsteroidEvents, 15)
        break
      case "ASTEROID_FIRST":
        this.specialEvents = []
        this.isTimeSuspended$.next(true)
        this._gameService.launchShipDoorAnimation()
        setTimeout(() => {
          this._gameService.isBackgroundMoving$.next(true)
          this._gameService.setGameBackground("asteroidEvent")
          this._gameService.setDeckVisible(false)
        }, 1000)
        break
      case "ASTEROID_LAST":
        this.isTimeSuspended$.next(false)
        this._gameService.isBackgroundMoving$.next(false)
        if (checkArraysMatch(this.specialEvents, asteroidSequence)) {
          this.specialEvents = []
          this._itemService.cartographerMap$.next(false)
          this._userService.removeItem("CARTOGRAPHER_MAP")
          this.openQuestSnackbar("Survive an asteroid field")
          this._questService.removeQuest("REPAIRS_2")
          this.eventsPool = shuffleEventArray(
            this.eventsPool.concat(skjoldEventsCollection)
          )
          this.eventsPool.unshift(skjoldIntroEvents[0])
          this.injectFollowedEvent(skjoldBunkerEvents, 20)
        } else {
          this.injectFollowedEvent(skjoldAsteroidEvents, 15)
          this.eventsPool.unshift(asteroidEventFail)
        }
        this._gameService.setGameBackground("classicShip")
        this._gameService.setDeckVisible(true)
        break

      case "SKJOLD_BUNKER":
        this.openQuestSnackbar("Find the Federation tech's cache")
        this._questService.removeQuest("SJKOLD_BUNKER")
        this._itemService.federationWarper$.next(true)
        this._userService.addItem("FEDERATION_WARPER")
        this._gameService.launchBlackScreenAnimation()
        this.eventsPool = [...pastEventsIntro, ...this.eventsPool]
        setTimeout(() => {
          this._gameService.setGameBackground("pastShip")
        }, 1000)
        break
      default:
        break
    }
  }

  // LIGHT YEAR READER

  lightYearReader(lightYear: number): void {
    switch (lightYear) {
      case 15:
        if (
          !this._questService.isQuestDone("EXTOSOPIA") ||
          !this._userService.checkInventory("GAUGE_RELIC")
        ) {
          this.eventsPool.unshift(
            lightYearEvents.find((event) => event.quest === "EXTOSOPIA") ||
              ({} as EventModel)
          )
          this.openQuestSnackbar("Reach Extosopia-3")
          this._questService.removeQuest("EXTOSOPIA")
          this.injectFollowedEvent(extosopiaIntroEvents, 10)
        }
        break

      default:
        break
    }
  }

  // SNACKBAR

  openQuestSnackbar(message: string): void {
    this.showSnackbar$.next(true)
    this.snackbarMessage$.next(message)
    setTimeout(() => {
      this.showSnackbar$.next(false)
      this.snackbarMessage$.next("")
    }, 3500)
  }
}

import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ItemService {
  gaugeRelic$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  chronicubeRelic$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )
  cartographerMap$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )
  federationWarper$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )

  itemsImage: { [key: string]: string } = {
    GAUGE_RELIC: "../../../assets/images/items/gauge-relic-item.webp",
    CARTOGRAPHER_MAP: "../../../assets/images/items/cartographer-map.webp",
    FEDERATION_WARPER: "../../../assets/images/items/fed-warper.webp",
  }

  itemsInformation: {
    [key: string]: {
      name: string
      desc: string
    }
  } = {
    GAUGE_RELIC: {
      name: "Farseer Relic",
      desc: "A strange relic that allows you to anticipate the future.. somehow. It feels like some parts are missing.",
    },
    CARTOGRAPHER_MAP: {
      name: "Asteroid map",
      desc: "This map seems to picture an asteroid field.. It's supposed to give directions, but how ?",
    },
    FEDERATION_WARPER: {
      name: "Federation Warper",
      desc: "Looks like a time-teleporter, but it's able to send us even further than our ship's temporal engine.",
    },
  }

  resetItems(): void {
    this.gaugeRelic$.next(false)
    this.cartographerMap$.next(false)
    this.federationWarper$.next(false)
  }
}

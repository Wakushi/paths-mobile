import { EventModel } from "src/app/models/event.model"

// NPCs
const IA_MERIDIANA_IMAGE: string = "../../assets/images/pnj/AI.webp"
const COMMANDANT_THALIA_IMAGE: string = "../../assets/images/pnj/thalia.webp"
const CHRONOMECANICIEN_GRIGGS_IMAGE: string =
  "../../assets/images/pnj/mechanic.webp"
const NAVIGATOR_KASSIOPEIA_IMAGE: string =
  "../../assets/images/pnj/navigator.webp"
const ARCHITECTE_STELLAIRE_ORION_IMAGE: string =
  "../../assets/images/pnj/architect.webp"
const DATA_ARCHIVISTE_ALTAIR_IMAGE: string =
  "../../assets/images/pnj/archivist.webp"
const DOCTOR_PROXIMA_IMAGE: string = "../../assets/images/pnj/doctor.webp"
const INGENIEUR_ENERGIE_ZOLTAN_IMAGE: string =
  "../../assets/images/pnj/engineer.webp"

export const pastEventsIntro: EventModel[] = [
  {
    eventName: "An unknown time zone",
    dialog:
      "Hm.. Captain, I'm not sure where we are. I can't find any reference in my database. We are in an unknown time zone.",
    eventImage: IA_MERIDIANA_IMAGE,
    rightChoice: {
      text: "What do you mean ?",
      consequence: {},
    },
    leftChoice: {
      text: "The ship.. looks older..",
      consequence: {},
    },
  },
  {
    eventName: "An unknown time zone",
    dialog:
      "It seems the federation device isn't working. You can try to activate it again, but we'll never be sure of the time zone we'll end up in.",
    eventImage: IA_MERIDIANA_IMAGE,
    rightChoice: {
      text: "Ok.. thanks Meridiana.",
      consequence: {},
    },
    leftChoice: {
      text: "Got it.",
      consequence: {},
    },
  },
]

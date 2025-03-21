
// Basic Indian legal knowledge store

export interface LegalSection {
  code: string;
  number: string;
  title: string;
  description: string;
  punishment?: string;
}

export const ipcSections: LegalSection[] = [
  {
    code: "IPC",
    number: "302",
    title: "Punishment for murder",
    description: "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
    punishment: "Death or imprisonment for life, and fine"
  },
  {
    code: "IPC",
    number: "376",
    title: "Punishment for rape",
    description: "Whoever commits rape shall be punished with rigorous imprisonment for a term not less than ten years, but which may extend to imprisonment for life, and shall also be liable to fine.",
    punishment: "Rigorous imprisonment for 10 years to life, and fine"
  },
  {
    code: "IPC",
    number: "420",
    title: "Cheating and dishonestly inducing delivery of property",
    description: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment.",
    punishment: "Imprisonment up to 7 years, and fine"
  },
  {
    code: "IPC",
    number: "304B",
    title: "Dowry death",
    description: "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage and it is shown that soon before her death she was subjected to cruelty or harassment by her husband or any relative of her husband for, or in connection with, any demand for dowry, such death shall be called 'dowry death'.",
    punishment: "Imprisonment for not less than 7 years but which may extend to imprisonment for life"
  },
  {
    code: "IPC",
    number: "498A",
    title: "Husband or relative of husband of a woman subjecting her to cruelty",
    description: "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished with imprisonment.",
    punishment: "Imprisonment up to 3 years and fine"
  }
];

export const crpcSections: LegalSection[] = [
  {
    code: "CrPC",
    number: "154",
    title: "Information in cognizable cases",
    description: "Every information relating to the commission of a cognizable offence, if given orally to an officer in charge of a police station, shall be reduced to writing by him or under his direction."
  },
  {
    code: "CrPC",
    number: "156",
    title: "Police officer's power to investigate cognizable case",
    description: "Any officer in charge of a police station may, without the order of a Magistrate, investigate any cognizable case which a Court having jurisdiction over the local area within the limits of such station would have power to inquire into or try under the provisions of Chapter XIII."
  },
  {
    code: "CrPC",
    number: "164",
    title: "Recording of confessions and statements",
    description: "Any Metropolitan Magistrate or Judicial Magistrate may, whether or not he has jurisdiction in the case, record any confession or statement made to him in the course of an investigation or at any time afterwards before the commencement of the inquiry or trial."
  },
  {
    code: "CrPC",
    number: "41",
    title: "When police may arrest without warrant",
    description: "Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has committed a cognizable offence, or against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists, of his having been concerned in a cognizable offence."
  }
];

export const legalProcedures = {
  "file_fir": {
    title: "Filing an FIR (First Information Report)",
    steps: [
      "Visit the police station in whose jurisdiction the offense occurred",
      "Provide a written or oral complaint detailing the incident",
      "Police officer must register the FIR if the offense is cognizable",
      "Get a free copy of the FIR",
      "If police refuse to register an FIR for a cognizable offense, approach the Superintendent of Police or file a complaint with the Magistrate under Section 156(3) CrPC"
    ]
  },
  "bail_process": {
    title: "Bail Process",
    steps: [
      "File bail application in the appropriate court",
      "For bailable offenses, bail is a matter of right",
      "For non-bailable offenses, it's at the court's discretion",
      "Factors considered: severity of crime, flight risk, evidence tampering possibility",
      "Bail can be regular (by court) or anticipatory (before arrest)"
    ]
  },
  "domestic_violence": {
    title: "Domestic Violence Complaint",
    steps: [
      "File complaint under Protection of Women from Domestic Violence Act, 2005",
      "Approach Protection Officer, police, or Magistrate directly",
      "Get protection orders, residence orders, monetary relief",
      "Free legal aid is available for victims",
      "Cases are heard by Magistrate courts"
    ]
  }
};

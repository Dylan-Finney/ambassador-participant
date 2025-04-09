import { v4 as uuidv4 } from "uuid";
let unverified = {};
let verified = {};

export default function handler(req, res) {
  const body = req.body;
  const { email, firstName, lastName, id, event } = req.body;
  console.log({ email, firstName, lastName, id, unverified, verified });
  if (unverified[event] === undefined) {
    unverified[event] = {};
  }
  if (verified[event] === undefined) {
    verified[event] = {};
  }
  if (id === undefined) {
    const newID = uuidv4();
    unverified[event][newID] = { email, firstName, lastName };

    res.status(200).json({ id: newID, obj: unverified });
  } else {
    if (Object.keys(unverified[event]).includes(id)) {
      verified[event][id] = unverified[event][id];

      delete unverified[event][id];
      res.status(200).json({ obj: verified[event][id] });
    } else if (Object.keys(verified[event]).includes(id)) {
      res.status(200).json({ obj: verified[event][id] });
    } else {
      res.status(200).json({ obj: false });
    }
  }
}

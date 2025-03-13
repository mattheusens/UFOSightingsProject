export interface IUFOSighting {
  id: number;
  witnessName: string;
  location: {
    latitude: number;
    longitude: number;
  };
  description: string;
  picture: string;
  status: "unconfirmed" | "confirmed";
  dateTime: string;
  witnessContact: string;
}

export default {};

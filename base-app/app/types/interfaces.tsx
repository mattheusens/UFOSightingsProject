export default interface IUFOSighting {
  id: string;
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

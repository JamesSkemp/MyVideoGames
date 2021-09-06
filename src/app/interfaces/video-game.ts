export interface IVideoGame {
  title: string;
  system: {
    console: string;
    version: string;
  };
  purchase: {
    date: string;
    price: string;
    place: string;
  };
  sell: {
    date: string;
    price: string;
  }
  own: boolean;
  notes: string;
  meta: {
    id: number;
    addOn: boolean;
    beat: boolean;
    electronic: boolean;
    used: boolean;
  }
}

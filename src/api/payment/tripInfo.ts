export interface ITripInfo {
  date: string; // 'Mar 08',
  duration: string; // '2h 05m',
  airline: {
    name: string; // 'Ryanair',
    flightNum: string; // 'FR 1080',
  };
  origin: {
    city: string; // 'Dubai',
    name: string; // 'London Stansted Airport',
    iata: string; // 'STN',
    time: string; // '12:45',
  };
  destination: {
    city: string; // 'Denver',
    name: string; // 'London Stansted Airport',
    iata: string; // 'STN',
    time: string; // '15:45',
  };
}

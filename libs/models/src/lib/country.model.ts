export type Country = {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  local_name: string;
  continent: Continent;
  active: boolean;
};

export enum Continent {
  Africa = 'Africa',
  Antarctica = 'Antarctica',
  Asia = 'Asia',
  Europe = 'Europe',
  Oceania = 'Oceania',
  NorthAmerica = 'North America',
  SouthAmerica = 'South America',
}

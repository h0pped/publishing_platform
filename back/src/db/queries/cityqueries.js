export const getByCountryID = (countryID) =>
  `Select * from city where country_id=${countryID};`;

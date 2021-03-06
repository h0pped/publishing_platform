export const getByCountryID = (countryID) =>
  `Select * from City where country_id=${countryID};`;

export const getByCountryAndTitle = (countryID, title) =>
  `Select * from City where country_id=${countryID} and title="${title}" LIMIT 1;`;

export const insertCity = (
  countryID,
  title
) => `Insert into City(\`country_id\`,\`title\`)
  value (${countryID},"${title}");`;

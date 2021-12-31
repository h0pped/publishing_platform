export const insertNewLocation = (location) => `
Insert into Location(\`city_id\`,\`user_id\`,\`street\`,\`postal_code\`)
value((Select id from city where title="${location.city}" and country_id="${location.countryID}"),(Select id from user where email="${location.userEmail}"),"${location.street}","${location.postalCode}");
`;

export const insertNewLocation = (location) => `
Insert into Location(\`city_id\`,\`user_id\`,\`street\`,\`postal_code\`)
value((Select id from City where title="${location.city}" and country_id="${location.countryID}"),(Select id from User where email="${location.userEmail}"),"${location.street}","${location.postalCode}");
`;

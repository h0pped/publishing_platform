export const insertNewLocation = (location) => `
Insert into Location(\`city_id\`,\`user_id\`,\`street\`,\`postal_code\`)
value((Select id from City where title="${location.city}" and country_id="${location.countryID}"),(Select id from User where email="${location.userEmail}"),"${location.street}","${location.postalCode}");
`;

export const getCountryAndCity = (userID) => `
select user_id, city_id,cc.id as "country_id", c.title as "city", cc.title "country" from \`Location\` l
inner join city c on l.city_id=c.id
inner join country cc on c.country_id=cc.id
where user_id=${userID}
`;

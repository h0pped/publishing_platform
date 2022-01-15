export const getPhotosByUserID = (
  userEmail
) => `Select Photo.id, u.email, Photo.name,filepath from Photo
inner join User u on u.id = Photo.user_id
Where u.email="${userEmail}";`;

export const addPhoto = (
  userEmail,
  name,
  filepath
) => `Insert into Photo(\`user_id\`,\`name\`,\`filepath\`) values
((Select id from user where email="${userEmail}"),
"${name}",
"${filepath}");`;

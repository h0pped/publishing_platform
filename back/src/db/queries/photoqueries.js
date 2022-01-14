export const getPhotosByUserID = (
  userEmail
) => `Select Photo.id, u.email, Photo.name,filepath from Photo
inner join User u on u.id = Photo.user_id
Where u.email="${userEmail}";`;

export const getAllUsers = () =>
  'Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id;';

export const findByEmail = (email) =>
  `Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id where User.email='${email}'; `;
export const findByID = (id) =>
  `Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id where User.ID='${id}'; `;

export const insertNewUser = (
  user
) => `insert into user(name,surname,email,profile_description,password,avatar_path,status_id,role_id,gender_id) values
  (
  "${user.name}",
  "${user.surname}",
  "${user.email}",
  "${user.description}",
  "${user.password}",
  "${user.imagepath}",
  (Select id from UserStatus where title="Active"),
  (Select id from UserRole where title="Default"),
  ${user.genderID}
  )`;

export const getFollowersFollowing = (email) => `Select 
Count(IF(following_id=(select id from user where email="${email}"),1,null)) as "Followers",
Count(IF(user_id=(select id from user where email="${email}"),1,null)) as "Following"
from Following;`;

export const getSocialMediaLinks = (
  email
) => `Select Link.title,Link.link, User.email from SocialMediaLink as Link
inner join user on user.id = Link.user_id
where user.email = "${email}";`;

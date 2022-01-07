export const getAllUsers = () =>
  'Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", UserStatus.title as "Status", UserRole.title as "Role" from User inner join UserStatus on UserStatus.id=User.status_id inner join UserRole on UserRole.id=User.role_id inner join Gender on Gender.id=User.gender_id;';

export const findByEmail = (email) =>
  `Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", UserStatus.title as "Status", UserRole.title as "Role" from User inner join UserStatus on UserStatus.id=User.status_id inner join UserRole on UserRole.id=User.role_id inner join Gender on Gender.id=User.gender_id where User.email='${email}'; `;
export const findByID = (id) =>
  `Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", UserStatus.title as "Status", UserRole.title as "Role" from User inner join UserStatus on UserStatus.id=User.status_id inner join UserRole on UserRole.id=User.role_id inner join Gender on Gender.id=User.gender_id where User.ID='${id}'; `;

export const insertNewUser = (
  user
) => `insert into User(name,surname,email,profile_description,password,avatar_path,status_id,role_id,gender_id) values
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
Count(IF(following_id=(select id from User where email="${email}"),1,null)) as "Followers",
Count(IF(User_id=(select id from User where email="${email}"),1,null)) as "Following"
from Following;`;

export const getSocialMediaLinks = (
  email
) => `Select Link.title,Link.link, User.email from SocialMediaLink as Link
inner join User on User.id = Link.user_id
where User.email = "${email}";`;

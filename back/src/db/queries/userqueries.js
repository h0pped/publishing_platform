export const getAllUsers = () =>
  'Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id;';

export const findByEmail = (email) =>
  `Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id where User.email='${email}'; `;

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

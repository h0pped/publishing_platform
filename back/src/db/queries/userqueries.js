export const getAllUsers = () =>
  'Select User.id, User.name,User.surname,User.email, User.profile_description,User.password,User.avatar_path,Gender.title as "Gender", userStatus.title as "Status", userRole.title as "Role" from User inner join userStatus on userStatus.id=User.status_id inner join userRole on userRole.id=User.role_id inner join Gender on Gender.id=User.gender_id;';

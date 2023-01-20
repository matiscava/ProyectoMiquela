import UserDtoForgetPassword from "../dto/user/userDtoForgetPassword.js";

const userMapper = () => {};

userMapper.mapUserToUserDtoForgetPassword = (u) => 
  new UserDtoForgetPassword(u.email,u.dni);

export default userMapper;
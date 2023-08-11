/* eslint-disable import/no-anonymous-default-export */
const checkComfirmPassword = (password, comfirmPassword) => {
  let objError = {};

  if (comfirmPassword === "") {
    objError.cfpassword = ["required"];
  }

  if (objError.cfpassword && password !== comfirmPassword) {
    objError.cfpassword.push("false_comfirm_password");

    return objError;
  } else if (!objError.cfpassword && password !== comfirmPassword) {
    objError.cfpassword = ["false_comfirm_password"];

    return objError;
  }

  return objError;
}

export {
  checkComfirmPassword,
};

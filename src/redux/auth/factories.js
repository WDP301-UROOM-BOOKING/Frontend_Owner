import ApiConstants from "../../adapter/ApiConstants";
import api from "../../libs/api/index";

const Factories = {
  login: (data) => {
    return api.post(ApiConstants.LOGIN_OWNER, data);
  },
  register_owner: (data) => {
    return api.post(ApiConstants.REGISTER_OWNER, data);
  },
  update_profile: (data) => {
    return api.post(ApiConstants.UPDATE_PROFILE, data);
  },
  change_password: (data) => {
    return api.post(ApiConstants.CHANGE_PASSWORD, data);
  },
  verify_email: (data) => {
    return api.post(ApiConstants.VERIFY_EMAIL, data);
  },
  resend_verification: (data) => {
    return api.post(ApiConstants.RESEND_VERIFICATION, data);
  },
  update_avatar: (formData) => {
    return api.put(ApiConstants.UPDATE_AVATAR, formData);
  },
};
export default Factories;

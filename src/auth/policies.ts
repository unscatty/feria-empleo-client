const ENV = process.env;

export const b2cPolicies = {
  names: {
    signUpSignIn: ENV.VUE_APP_B2C_SIGNINPOLICY,
    editProfile: '',
  },
  authorities: {
    signUpSignIn: {
      authority: `https://${ENV.VUE_APP_B2C_TENANT}.b2clogin.com/${ENV.VUE_APP_B2C_TENANT}.onmicrosoft.com/${ENV.VUE_APP_B2C_SIGNINPOLICY}`,
    },
    editProfile: {
      authority: '',
    },
  },
  authorityDomain: `${ENV.VUE_APP_B2C_TENANT}.b2clogin.com`,
};
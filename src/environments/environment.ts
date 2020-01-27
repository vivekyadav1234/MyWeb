// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  // apiBaseUrl: 'https://api.arrivae.com',
 
  // apiBaseUrl:'http://ec2-35-154-254-32.ap-south-1.compute.amazonaws.com',
  uiBaseUrl: 'http://localhost:4200',
   pptUrl: 'dev'
};

// get host-env - if local based on env otherwise get it from url
const getHostEnv = (host, env) => {
  const customs = ['sd.sta-jlr-apps.com'];
  if (host === 'localhost:8000' || host === 'localhost') {
    switch (env) {
      case 'sta-dev':
        return 'dev';
      case 'sta-test':
        return 'test';
      case 'sta-preprod':
        return 'preprod';
      case 'sta-prod':
        return 'prod';
      case 'sta-training':
        return 'training';
      default:
        return 'local';
    }
  } else if (customs.indexOf(host) !== -1) {
    if (host === 'sd.sta.jlr-apps.com') {
      return 'prod';
    }
  } else {
    const tmp = host.split('.');
    if (tmp[1] && tmp[1].length > 0) {
      return tmp[1];
    }
  }
  return false;
};

export function config() {
  let conf = {};
  const host = window.location.hostname;
  const env = process.env.NODE_ENV;

  const confs = {
    local: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers',
      devTool: true
    },
    dev: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers'
    },
    preprod: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers',
      devTool: false
    },
    training: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers',
      devTool: false
    },
    test: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers',
      devTool: true
    },
    prod: {
      loginUrl: 'https://api.dev.sta.jlr-apps.com',
      baseUrl: 'https://api.dev.sta.jlr-apps.com',
      logout: '/',
      userDelegates: '/user/1/MyDelegates',
      supplierDetailUrl: 'https://eupreprod.fabric.jlr-apps.com/Organisations/Suppliers/ManufacturingSites/',
      pswUrl: 'https://stadev.fabric.jlr-apps.com/STA/1/PartSubmissionWarrants',
      salt: 'aUF6RHlxUE8wd2NoRDVWT0NrM0FfaVIzUWJvYTpFT0tzNU1DeUc2VnB1RDBvTkpNaE5rR3YyZWth',
      notificationsApiUrl: '/notifications/1/',
      SDApi: '/Quality/SupplierDiagnostic/1',
      getWorklist: '/Quality/SupplierDiagnostic/1',
      getReasonList: '/Quality/SupplierDiagnostic/1/AssessmentReasons',
      getAssessmentType: '/Quality/SupplierDiagnostic/1/SupplierDiagnosticTypes',
      getMyManager: '/Quality/SupplierDiagnostic/1/MyManagers',
      devTool: false
    }
  };
  const hostEnv = getHostEnv(host, env);
  conf = (hostEnv) ? confs[getHostEnv(host, env)] : confs.dev;
  // refresh the notifications count (getUserNotificationsUnreadCount) every (1) minute
  conf.notificationsRefreshInterval = '60000';
  // filesize
  conf.maxFileSize = 1048576;
  // user timeout
  conf.timeout = 720000000;
  // checklist text limit
  conf.textLenght = 100;
  conf.maximumImageSize = 1048576;
  conf.maximumAudioDuration = 120;
  return conf;
}

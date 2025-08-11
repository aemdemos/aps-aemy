
// import {
//     API_ADD_PERMISSIONS,
//     API_UPDATE_EDS_CONFIG,
//   } from '../constants/index.js';

async function updateEDSPermission() {
    
    const FROMCRON = process.env.FROMCRON;
    const AUTHTOKEN = process.env.AUTHTOKEN;
    const CLIENTID = process.env.CLIENTID;
    const CLIENTSECRET = process.env.CLIENTSECRET;
    const GITORGID = process.env.GITORGID;
    const IMSORGID = process.env.IMSORGID;
    const PROGRAMID = process.env.PROGRAMID;
    

    try {

        const apiHeaders = {
            'x-auth-token': AUTHTOKEN,
            'x-git-org-id': GITORGID,
            'x-from-cron': FROMCRON,
            'x-cm-program-id': PROGRAMID,
            'x-cm-client-id': CLIENTID,
            'x-cm-client-secret': CLIENTSECRET,
            'x-cm-ims-org-id': IMSORGID,
          };
        
        const res = await fetch('https://113408-edsconfigautomation-stage.adobeioruntime.net/api/v1/web/eds-cm-config-automation-sa/cdn-add-permissions', {
          method: 'POST',
          headers: apiHeaders,
        });
        if (!res.ok) throw new Error(`Failed to add persmissison: ${res.statusText}`);
        const result = await res.json();

        console.log(result);
    
        // // Process updateEDSConfig in batches of 10
        // const batchSize = 10;
        // const updateResults = [];
        // for (let i = 0; i < result.data.siteUsersMapping.length; i += batchSize) {
        //   const batch = result.data.siteUsersMapping.slice(i, i + batchSize);
        //   const batchPromises = batch.map((user) => updateEDSConfig(user));
        //   /* eslint-disable no-await-in-loop */
        //   const batchResults = await Promise.all(batchPromises);
        //   updateResults.push(...batchResults);
        // }
    
        // return result.data.siteUsersMapping;
      } catch (err) {
        setStatus({ type: 'error', message: err.message });
        throw err;
      }


  }

  updateEDSPermission();


// import {
//     API_ADD_PERMISSIONS,
//     API_UPDATE_EDS_CONFIG,
//   } from '../constants/index.js';

async function updateEDSPermission() {

    try {

        const apiHeaders = {
            'x-auth-token': 'AUTHTOKEN',
            'x-git-org-id': process.env.GITORGID,
            'x-from-cron': 'true',
            'x-cm-program-id': process.env.PROGRAMID,
            'x-cm-client-id': process.env.CLIENTID,
            'x-cm-client-secret': process.env.CLIENTSECRET,
            'x-cm-ims-org-id': process.env.IMSORGID,
          };
        
        const res = await fetch('https://113408-edsconfigautomation-stage.adobeioruntime.net/api/v1/web/eds-cm-config-automation-sa/cdn-add-permissions', {
          method: 'POST',
          headers: apiHeaders,
        });
        if (!res.ok) throw new Error(`Failed to add persmissison: ${res.statusText}`);
        const result = await res.json();

        // for (const groups of result.data.siteUsersMapping) {
        //     console.log(groups.userEmails);
        // }
    
        // Process updateEDSConfig in batches of 10
        const batchSize = 10;
        const updateResults = [];
        for (let i = 0; i < result.data.siteUsersMapping.length; i += batchSize) {
          const batch = result.data.siteUsersMapping.slice(i, i + batchSize);
          const batchPromises = batch.map((user) => updateEDSConfig(user));
          /* eslint-disable no-await-in-loop */
          const batchResults = await Promise.all(batchPromises);
          updateResults.push(...batchResults);
        }
    
        return result.data.siteUsersMapping;
      } catch (err) {
        //setStatus({ type: 'error', message: err.message });
        throw err;
      }


  }

  const updateEDSConfig = async (user) => {
    if (user.userIds.length === 0) return null;
  
    const jsonBody = {
      admin: {
        role: {
          publish: user.userIds,
        },
        requireAuth: 'true',
      },
    };
  
    const opts = {
      method: 'POST',
      body: JSON.stringify(jsonBody),
      headers: getHeaders(),
    };
  
    const schoolId = user.schoolId.trim();
    const res = await fetch(`https://admin.hlx.page/config/brendoau/sites/${schoolId}/access.json`, opts);
  
    if (!res.ok) throw new Error(`Failed to update EDS config for ${schoolId}`);
    const result = await res.json();
    return result;
  };

  export function getHeaders({ type } = { type: 'json' }) {
    return {
      Authorization: process.env.AUTHTOKEN,
      'Content-Type': 'application/json',
    };
  }


  updateEDSPermission();

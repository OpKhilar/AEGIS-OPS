import { getOfflineStatuses, deleteOfflineStatus, getOfflineSOS, deleteOfflineSOS } from './offlineStore';
import { submitUserStatus, createIncident } from '../services/emergencyService';

export const syncOfflineData = async () => {
  if (!navigator.onLine) return;

  try {
    const statuses = await getOfflineStatuses();
    for (const status of statuses) {
      // Remove offlineTimestamp and id so it is inserted fresh
      const { offlineTimestamp, id, ...payload } = status;
      // We pass the id if it's the user ID, but wait, submitUserStatus expects statusReport.id to be the user_id
      // Let's keep the original payload mostly intact, except offline specific fields
      const { data, error } = await submitUserStatus(status);
      if (!error) {
        await deleteOfflineStatus(status.id);
        console.log('Synced status report:', status.id);
      } else {
        console.error('Failed to sync status:', error);
      }
    }

    const sosIncidents = await getOfflineSOS();
    for (const incident of sosIncidents) {
      const { offlineTimestamp, id, ...payload } = incident;
      const { data, error } = await createIncident(incident);
      if (!error) {
        await deleteOfflineSOS(incident.id);
        console.log('Synced SOS incident:', incident.id);
      } else {
        console.error('Failed to sync SOS incident:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
};

export const initSyncListener = () => {
  window.addEventListener('online', syncOfflineData);
  // Also run once on startup in case we are already online with queued data
  if (navigator.onLine) {
    syncOfflineData();
  }
};

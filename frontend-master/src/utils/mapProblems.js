import { getZabbixLink } from '@/utils/ApiUtils.js';
import useBaseUrl from '@/composables/useBaseUrl.js';

const FLAG_TRUE = '1';
const { baseUrl } = useBaseUrl();

export const mapProblems = problems => {
  const list = {};
  const onMaintenanceItems = [];
  let maxSeverity = 0;
  if (!problems.length) return {problems: list, onMaintenanceItems, maxSeverity};
  problems.forEach(item => {
    item.problems.forEach(problem => {
      const isMaintenance = item.maintenance_status === FLAG_TRUE;
      if (isMaintenance && !onMaintenanceItems.includes(item.name)) {
        onMaintenanceItems.push(item.name);
      }
      if (+problem.severity > maxSeverity) maxSeverity = +problem.severity;
      if (!list[problem.severity]) list[problem.severity] = [];
      list[problem.severity].push({
        itemName: item.name,
        isMaintenance,
        message: problem.name,
        link: getZabbixLink({
          baseUrl: baseUrl.value,
          triggerId: problem.relatedObject.triggerid,
          eventId: problem.eventid
        }),
        isSuppressed: problem.suppressed === FLAG_TRUE,
      });
    });
  });
  return {problems: list, onMaintenanceItems, maxSeverity};
};
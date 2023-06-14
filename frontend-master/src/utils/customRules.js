const FIRE_PROBLEM_MESSAGE = 'Авария: Пожар';
const FIRE_NO_DATA_MESSAGE_1 = 'Недоступно по ICMP ping (в течение #3)';
const FIRE_NO_DATA_MESSAGE_2 = 'Нет сбора данных по SNMP';
// TODO: del this line after update test-bacend:
const FIRE_NO_DATA_MESSAGE_OLD = 'Unavailable by ICMP ping';
export const CONNECT_FAIL_STATUS = 'fail';

export const fireCustomRule = ({ typesNames, result, node }) => {
  if (!(typesNames?.conditioner[0] && result && node)) return false;

  const fireType = typesNames.conditioner[0];
  const conditioner = result[node][fireType];
  if (conditioner) {
    conditioner.forEach(item => {
      item.problems.forEach(problem => {
        if (problem.name === FIRE_PROBLEM_MESSAGE) return [item];
        if (problem.name === FIRE_NO_DATA_MESSAGE_1 ||
        // TODO: del this line after update test-bacend:
          problem.name === FIRE_NO_DATA_MESSAGE_OLD ||
          problem.name === FIRE_NO_DATA_MESSAGE_2) {
          return ({ connect: CONNECT_FAIL_STATUS });
        }
      });
    });
  }
  return false;
};
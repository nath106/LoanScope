import { validateInputs } from './validation'

export const DEFAULTS = { principal: "10000", rate: "6", payment: "200" };

export function readScenario(search) {
  const params = new URLSearchParams(search);

  // missing params become "", which validation already treats as an error
  const scenario = {
  principal: params.get("principal") ?? DEFAULTS.principal,
  rate: params.get("rate") ?? DEFAULTS.rate,
  payment: params.get("payment") ?? DEFAULTS.payment,
};

  // 1. replace any invalid principal or rate with its default
  const first = validateInputs(scenario.principal, scenario.rate, scenario.payment);
  if (first.errors.principal) scenario.principal = DEFAULTS.principal;
  if (first.errors.rate) scenario.rate = DEFAULTS.rate;

  // 2. payment depends on the other two, so check it after they're fixed
  const second = validateInputs(scenario.principal, scenario.rate, scenario.payment);
  if (second.errors.payment) {
    // twice the monthly interest always passes REQ-3 and REQ-4
    scenario.payment = String(Math.max(1, Math.ceil(second.monthlyInterest * 2)));
  }

  return scenario;
}
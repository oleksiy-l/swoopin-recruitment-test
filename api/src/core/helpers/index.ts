export const checkVehicleParam = (param: string): boolean | string => {
  const availableParameters = ["speed", "temperature", "plate", "status"];
  if (!availableParameters.find((s) => s === param)) {
    return param;
  }
  return false;
};

export const defineParam = (param: string, value: string | number) => {
  console.log(param, value)
}
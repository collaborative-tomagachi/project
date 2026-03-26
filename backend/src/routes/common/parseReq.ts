import { ValidationError } from "@src/common/utils/route-errors";

function parseReq<U extends any>(schema: U) {
  return (data: any) => {
    // Basic validation - add more later
    if (!data) {
      throw new ValidationError(["No data provided"]);
    }
    return data;
  };
}

export default parseReq;

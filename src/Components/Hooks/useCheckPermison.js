import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useCheckPermission = (checkPermission) => {
  const [check, setCheck] = useState(false);
  const accountFunctions = useSelector((state) => state.Profile.permission);
  useEffect(() => {
    if (typeof checkPermission === "number") {
      if (accountFunctions.some((e) => e.function_id === checkPermission)) {
        setCheck(true);
      } else {
        accountFunctions.forEach((e) => {
          if (
            e.child_functions.some((e) => e.function_id === checkPermission)
          ) {
            setCheck(true);
          }
        });
      }
    }
  }, [accountFunctions]);
  return check;
};

export default useCheckPermission;

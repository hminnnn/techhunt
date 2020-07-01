import { Growl } from "primereact/growl";
import React, { useEffect, useRef } from "react";

interface GrowlProps {
  type: string;
  message: string;
  growlCallback: Function;
}
export function GrowlProvider(props: GrowlProps) {
  let growl = useRef<any>(null);

  useEffect(() => {
    if (
      props.type !== undefined &&
      props.type !== "" &&
      props.message !== undefined &&
      props.message !== ""
    ) {
      if (props.type === "success") {
        growl.current.show({
          severity: "success",
          summary: "Success",
          detail: props.message,
        });
      } else if (props.type === "error") {
        growl.current.show({
          severity: "error",
          summary: "Error",
          detail: props.message,
        });
      }
      props.growlCallback(true)
    }
  }, [props]);

  return <Growl ref={growl} />;
}

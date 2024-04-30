import { Fragment } from "react";
import NotFound from '$src/components/not-found';
import { Hello } from "provider/Hello";

export default function () {
  return (
    <Fragment>
      <NotFound />
      <Hello origin="mf-customer" />
    </Fragment>
  );
}

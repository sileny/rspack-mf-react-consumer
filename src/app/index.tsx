import styles from './index.module.scss';
import NotFound from '$src/components/not-found';
import { Hello } from "provider/Hello";

export default function () {
  return (
    <div className={styles.content}>
      <NotFound />
      <Hello />
    </div>
  );
}

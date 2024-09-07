import styles from "./styles.module.scss";
import { Button } from "../../../shared/ui/components/Button";

const TestPage = () => {
  return (
    <main className={styles.main}>
      <div>TestPage Container</div>
      <Button>
        Button
      </Button>
    </main>
  );
};

export default TestPage;
import styles from "./styles.module.scss";
import { Button, ButtonType, DisplayMode } from "../../../shared/ui/components/Button";
import { IconButton } from "@mui/material";
import { Add, Cancel, ChevronLeft, Delete, Done, MailLock } from "@mui/icons-material";
import { Badge, BadgeType } from "../../../shared/ui/components/Badge";

const TestPage = () => {
  return (
    <main className={styles.main}>
      <div>TestPage Container</div>
      <form action="https://echo.htmlacademy.ru/" method="POST">
        <input type="text" name={'dfg'} id={'aidi'}/>
        <Button
          displayMode={DisplayMode.primary}
          BeforeButtonIcon={Add}
          AfterButtonIcon={ChevronLeft}
          // size={ButtonSize.medium}
          // disabled={false}

          type={ButtonType.button}
        >
          Button
        </Button>

      </form>
      <Badge
        type={BadgeType.green}
        BeforeBadgeIcon={Cancel}
        AfterBadgeIcon={Done}
      >
        Text
      </Badge>

      <IconButton size={"large"}>
        <Delete/>
      </IconButton>
      <Badge badgeContent={4} color="primary">
        <MailLock color="action"/>
      </Badge>
    </main>
  );
};

export default TestPage;
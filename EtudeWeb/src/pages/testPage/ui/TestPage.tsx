import styles from "./styles.module.scss";
import { Button, ButtonSize, ButtonType, DisplayMode } from "../../../shared/ui/components/Button";
import { IconButton } from "@mui/material";
import { Cancel, Delete, Done, MailLock } from "@mui/icons-material";
import { Badge, BadgeType } from "../../../shared/ui/components/Badge";
import { Checkbox, CheckboxSize } from "../../../shared/ui/components/Checkbox";
import { Comment, CommentType } from "../../../shared/ui/components/Comment";

const TestPage = () => {
  return (
    <main className={styles.main}>
      <div>TestPage Container</div>
      <form action="https://echo.htmlacademy.ru/" method="POST">
        <input type="text" name={'dfg'} id={'aidi'}/>
        <Checkbox
          description={""}
          checkboxSize={CheckboxSize.large}
          name={""}
          disabled={false}
          tooltipText={"fghfdgh"}
        />
        <Checkbox
          description={"Test Small"}
          checkboxSize={CheckboxSize.small}
          name={"yeah"}
          disabled={false}
          tooltipText={"fghfdgh"}
        />
        <Button
          displayMode={DisplayMode.primary}
          BeforeButtonIcon={Delete}
          // AfterButtonIcon={ChevronLeft}
          size={ButtonSize.medium}
          disabled={false}

          type={ButtonType.submit}
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

      <Comment
        title="Title Full Name I allow you to provide that action"
        fullName="Full Name"
        position="Director I allow you to provide that action."
        commentText="I allow you to provide that action. I allow you to provide that action. I allow you to provide that action. I allow you to provide that action. I allow you to provide that action."
        type={CommentType.accept}
      />

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
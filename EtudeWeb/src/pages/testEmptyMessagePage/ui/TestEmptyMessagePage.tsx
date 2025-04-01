import EmptyMessage from "@/shared/ui/emptyMessage/EmptyMessage.tsx";
import { Button } from "@/shared/ui/button";
import EmptyStateSvg from "@/shared/assets/images/empty-states/empty.svg"
import { Add } from "@mui/icons-material";


const TestEmptyMessagePage = () => {
  return (
    <div className="flex">
      <EmptyMessage
        variant="large"
        imageUrl={EmptyStateSvg}
        title="Нет шаблонов курсов"
        description="Вы можете создать шаблон курса"
        actionButton={<Button leftIcon={<Add/>}>Создать шаблон</Button>}
        className="mr-5"
      />

      <EmptyMessage
        variant="small"
        imageUrl={EmptyStateSvg}
        title="Нет шаблонов курсов"
        description="Вы можете создать шаблон курса"
        actionButton={<Button leftIcon={<Add/>}>Создать шаблон</Button>}
      />
    </div>
  );
};

export default TestEmptyMessagePage;
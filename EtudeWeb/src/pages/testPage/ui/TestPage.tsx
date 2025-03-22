import { Button } from "@/shared/ui/button/Button";
import { OpenInNew, ArrowBack } from "@mui/icons-material";

const TestPage = () => {
  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold mb-4">Примеры кнопок</h1>

      {/* Секция с primary кнопками */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Primary</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="primary"
            size="large"
            leftIcon={<OpenInNew />}
          >
            Button
          </Button>

          <Button
            variant="primary"
            size="medium"
          >
            Button
          </Button>

          <Button
            variant="secondary"
            size="large"
            rightIcon={<ArrowBack />}
            leftIcon={<ArrowBack />}
          >
            Button
          </Button>

          <Button
            variant="primary"
            size="large"
            disabled
          >
            Disabled
          </Button>
        </div>
      </div>

      {/* Секция с secondary кнопками */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Secondary</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="secondary"
            size="large"
            leftIcon={<OpenInNew />}
          >
            Button
          </Button>

          <Button
            variant="secondary"
            size="medium"
          >
            Button
          </Button>

          <Button
            variant="secondary"
            size="small"
            rightIcon={<ArrowBack />}
          >
            Button
          </Button>

          <Button
            variant="secondary"
            size="large"
            disabled
          >
            Disabled
          </Button>
        </div>
      </div>

      {/* Секция с third кнопками */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Third</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="third"
            size="large"
            leftIcon={<OpenInNew />}
          >
            Button
          </Button>

          <Button
            variant="third"
            size="medium"
          >
            Button
          </Button>

          <Button
            variant="third"
            size="small"
            rightIcon={<ArrowBack />}
          >
            Button
          </Button>

          <Button
            variant="third"
            size="large"
            disabled
          >
            Disabled
          </Button>
        </div>
      </div>

      {/* Пример использования в качестве ссылки */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Использование как ссылка</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            as="a"
            href="https://example.com"
            variant="third"
            size="large"
            leftIcon={<OpenInNew />}
            rightIcon={<OpenInNew />}
          >
            Внешняя ссылка
          </Button>

          <Button
            as="link"
            to="/calendar"
            variant="third"
            size="medium"
          >
            Внутренняя ссылка (react-router)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
import { useRef, useState } from "react";
import {
  AddCircleOutline,
  Block,
  Delete,
  DisabledByDefault,
  Edit,
  Logout,
  MoreVert,
  Person, PersonAddDisabled,
  Settings
} from "@mui/icons-material";
import { Button } from "@/shared/ui/button";
import { DropdownMenu } from "@/shared/ui/dropdownmenu";

const TestDropdownMenuPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const defaultItems = [
    {
      label: 'Личный кабинет',
      icon: <Person />,
      onClick: () => console.log('Редактировать')
    },{
      label: 'Личный кабинет',
      icon: <Person />,
      onClick: () => console.log('Редактировать')
    },{
      label: 'Личный кабинет',
      icon: <Person />,
      onClick: () => console.log('Редактировать')
    },
    {
      label: 'Настройки',
      icon: <Settings />,
      onClick: () => console.log('Настройки')
    },
    {
      label: 'Добавить',
      icon: <AddCircleOutline />,
      onClick: () => console.log('Добавить')
    },
    {
      label: 'Отключенный пункт',
      disabled: true,
      icon: <PersonAddDisabled />,
      onClick: () => console.log('Этот обработчик не будет вызван')
    }
  ];

  const warningItems = [
    {
      label: 'Выйти из системы',
      icon: <Logout />,
      onClick: () => console.log('Заблокировать')
    },
    {
      label: 'Удалить',
      icon: <Delete />,
      onClick: () => console.log('Удалить')
    }
  ];

  const handleToggleMenu = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-h2 mb-4">Пример использования DropdownMenu</h2>

      <div className="flex items-center gap-4">
        <Button
          ref={buttonRef}
          onClick={handleToggleMenu}
          rightIcon={<MoreVert />}
        >
          {isOpen ? 'Закрыть меню' : 'Открыть меню'}
        </Button>

        <DropdownMenu
          open={isOpen}
          onClose={handleCloseMenu}
          anchorEl={buttonRef.current}
          position="bottom-right"
          defaultItems={defaultItems}
          warningItems={warningItems}
        />
      </div>

      <div className="mt-8">
        <pre className="p-4 bg-mono-100 rounded">
          {`// Примечание:
// Иконки в этом примере импортированы из @mui/icons-material
// Пример импорта:
// import { Edit, Delete, Block, Settings, AddCircleOutline } from '@mui/icons-material';`}
        </pre>
      </div>
    </div>
  );
};

export default TestDropdownMenuPage;
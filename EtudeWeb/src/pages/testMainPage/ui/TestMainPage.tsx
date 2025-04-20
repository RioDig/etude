import { Typography } from '@/shared/ui/typography'
import { Button } from '@/shared/ui/button'
import { Table } from '@/widgets/table'

export const TestMainPage = () => {
  return (
    <div className={'container mx-auto p-8'}>
      <Typography variant={'h1'} className={'text-center mb-4'}>
        Добро пожаловать в EtudeWeb
      </Typography>
      <Typography variant={'b1'} className={'mb-4'}>
        Ниже представлены тестовые страницы для проверки UI-KIT проекта:
      </Typography>
      <div>
        <Table className="max-h-[600px] overflow-y-auto">
          <Table.Header>
            <Table.HeaderCell sortField="name" sortable>
              Название компонента
            </Table.HeaderCell>
            <Table.HeaderCell>Кнопка перехода</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Badge</Table.Cell>
              <Table.Cell>
                <Button to="/test-badge">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Button</Table.Cell>
              <Table.Cell>
                <Button to="/test-button">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Checkbox</Table.Cell>
              <Table.Cell>
                <Button to="/test-checkbox">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Controls</Table.Cell>
              <Table.Cell>
                <Button to="/test-control">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Counter</Table.Cell>
              <Table.Cell>
                <Button to="/test-counter">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>DropdownMenu</Table.Cell>
              <Table.Cell>
                <Button to="/test-dropdownmenu">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>EmptyMessage</Table.Cell>
              <Table.Cell>
                <Button to="/test-emptymessage">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Filter</Table.Cell>
              <Table.Cell>
                <Button to="/test-filter">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Hint</Table.Cell>
              <Table.Cell>
                <Button to="/test-hint">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Modal</Table.Cell>
              <Table.Cell>
                <Button to="/test-modal">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Notification</Table.Cell>
              <Table.Cell>
                <Button to="/test-notification">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Sidebar</Table.Cell>
              <Table.Cell>
                <Button to="/test-sidebar">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Stepper</Table.Cell>
              <Table.Cell>
                <Button to="/test-stepper">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Switch</Table.Cell>
              <Table.Cell>
                <Button to="/test-switch">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Table</Table.Cell>
              <Table.Cell>
                <Button to="/test-table">Перейти</Button>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Typography</Table.Cell>
              <Table.Cell>
                <Button to="/test-typography">Перейти</Button>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default TestMainPage

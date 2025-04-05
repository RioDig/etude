import React, { useState } from 'react';
import { Table, SortState, TableColumn } from '@/widgets/table';
import { Tag } from '@/shared/ui/tag';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Edit, Delete, TableChart } from '@mui/icons-material';

// Тип для данных
interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  manufacturer: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Мок-данные для примера
const mockProducts: Product[] = [
  {
    id: '1',
    code: 'PRD-001',
    name: 'Ноутбук HP EliteBook 840 G7',
    category: 'Компьютеры',
    price: 89990,
    stock: 15,
    manufacturer: 'HP',
    status: 'in-stock'
  },
  {
    id: '2',
    code: 'PRD-002',
    name: 'Смартфон Samsung Galaxy S21',
    category: 'Телефоны',
    price: 54990,
    stock: 28,
    manufacturer: 'Samsung',
    status: 'in-stock'
  },
  {
    id: '3',
    code: 'PRD-003',
    name: 'Планшет Apple iPad Pro 12.9"',
    category: 'Планшеты',
    price: 99990,
    stock: 5,
    manufacturer: 'Apple',
    status: 'low-stock'
  },
  {
    id: '4',
    code: 'PRD-004',
    name: 'Монитор Dell UltraSharp 32" 4K',
    category: 'Мониторы',
    price: 42990,
    stock: 0,
    manufacturer: 'Dell',
    status: 'out-of-stock'
  },
  {
    id: '5',
    code: 'PRD-005',
    name: 'Клавиатура Logitech MX Keys',
    category: 'Периферия',
    price: 9990,
    stock: 32,
    manufacturer: 'Logitech',
    status: 'in-stock'
  }
];

// Компонент для рендеринга статуса
const StatusBadge: React.FC<{ status: Product['status'] }> = ({ status }) => {
  switch (status) {
    case 'in-stock':
      return <Badge variant="success">В наличии</Badge>;
    case 'low-stock':
      return <Badge variant="warning">Мало</Badge>;
    case 'out-of-stock':
      return <Badge variant="error">Нет в наличии</Badge>;
    default:
      return null;
  }
};

// Компонент для рендеринга цены
const PriceCell: React.FC<{ price: number }> = ({ price }) => (
  <div className="text-right font-medium">
    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price)}
  </div>
);

const TestTablePage: React.FC = () => {
  // Состояние для сортировки
  const [sortState, setSortState] = useState<SortState>({
    field: '',
    direction: null
  });

  // Состояние для переключения между режимами таблицы
  const [scrollable, setScrollable] = useState<boolean>(true);

  // Функция обработки сортировки
  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState);
  };

  // Обработчики действий
  const handleEdit = (id: string) => {
    console.log(`Редактирование товара с ID: ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Удаление товара с ID: ${id}`);
  };

  // Определение колонок для скроллируемого режима (фиксированные ширины в px)
  const scrollableColumns: TableColumn<Product>[] = [
    {
      id: 'code',
      header: 'Код',
      accessor: 'code',
      sortable: true,
      width: '100px',
    },
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '300px',
    },
    {
      id: 'category',
      header: 'Категория',
      accessor: 'category',
      sortable: true,
      width: '150px',
      render: (item) => (
        <Tag>{item.category}</Tag>
      )
    },
    {
      id: 'price',
      header: 'Цена',
      accessor: 'price',
      sortable: true,
      width: '120px',
      render: (item) => <PriceCell price={item.price} />
    },
    {
      id: 'stock',
      header: 'Запасы',
      accessor: 'stock',
      sortable: true,
      width: '100px',
    },
    {
      id: 'manufacturer',
      header: 'Производитель',
      accessor: 'manufacturer',
      sortable: true,
      width: '150px',
    },
    {
      id: 'status',
      header: 'Статус',
      accessor: 'status',
      sortable: true,
      width: '150px',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      id: 'actions',
      header: 'Действия',
      width: '200px',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="third"
            size="small"
            leftIcon={<Edit />}
            onClick={() => handleEdit(item.id)}
          >
            Изменить
          </Button>
          <Button
            variant="third"
            size="small"
            leftIcon={<Delete />}
            onClick={() => handleDelete(item.id)}
          >
            Удалить
          </Button>
        </div>
      )
    }
  ];

  // Определение колонок для режима растягивающихся колонок (ширины в %)
  const autoWidthColumns: TableColumn<Product>[] = [
    {
      id: 'code',
      header: 'Код',
      accessor: 'code',
      sortable: true,
      width: '10%',
    },
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '25%',
    },
    {
      id: 'category',
      header: 'Категория',
      accessor: 'category',
      sortable: true,
      width: '10%',
      render: (item) => (
        <Tag>{item.category}</Tag>
      )
    },
    {
      id: 'price',
      header: 'Цена',
      accessor: 'price',
      sortable: true,
      width: '10%',
      render: (item) => <PriceCell price={item.price} />
    },
    {
      id: 'stock',
      header: 'Запасы',
      accessor: 'stock',
      sortable: true,
      width: '10%',
    },
    {
      id: 'manufacturer',
      header: 'Производитель',
      accessor: 'manufacturer',
      sortable: true,
      width: '15%',
    },
    {
      id: 'status',
      header: 'Статус',
      accessor: 'status',
      sortable: true,
      width: '10%',
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      id: 'actions',
      header: 'Действия',
      width: '10%',
      render: (item) => (
        <div className="flex gap-2">
          <Button
            variant="third"
            size="small"
            leftIcon={<Edit />}
            onClick={() => handleEdit(item.id)}
          >
            Изменить
          </Button>
        </div>
      )
    }
  ];

  // Выбираем колонки в зависимости от режима
  const columns = scrollable ? scrollableColumns : autoWidthColumns;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-h1 mb-6">Таблица с настраиваемой шириной</h1>

      <div className="mb-6 flex items-center gap-4">
        <span className="text-b3">Режим таблицы:</span>
        <Button
          variant={scrollable ? 'primary' : 'secondary'}
          onClick={() => setScrollable(true)}
          leftIcon={<TableChart />}
        >
          Фиксированная ширина + скролл
        </Button>
        <Button
          variant={!scrollable ? 'primary' : 'secondary'}
          onClick={() => setScrollable(false)}
          leftIcon={<TableChart />}
        >
          Растягивающиеся колонки
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-h2 mb-4">
          {scrollable
            ? 'Режим с фиксированной шириной и горизонтальным скроллом'
            : 'Режим с растягивающимися колонками'}
        </h2>
        <p className="text-b3-regular mb-4 text-mono-700">
          {scrollable
            ? 'Колонки имеют фиксированную ширину в пикселях. При недостатке места появляется горизонтальный скролл.'
            : 'Колонки растягиваются для заполнения всей ширины контейнера. Ширина колонок задается в процентах.'}
        </p>

        <div className="w-full border border-mono-300 p-4 rounded mb-8">
          <Table
            data={mockProducts}
            columns={columns}
            sortState={sortState}
            onSort={handleSort}
            scrollable={scrollable}
            className="shadow-sm"
          />
        </div>

        <h3 className="text-h2 mb-4">Конфигурация колонок</h3>

        <div className="mb-4">
          <p className="text-b3-regular mb-2 text-mono-700">
            {scrollable
              ? 'Колонки с фиксированной шириной (в пикселях):'
              : 'Колонки с процентной шириной (в сумме 100%):'}
          </p>
          <pre className="bg-mono-100 p-4 rounded text-mono-800 overflow-auto text-sm">
{JSON.stringify(columns.map(col => ({
  id: col.id,
  width: col.width,
  header: col.header
})), null, 2)}
          </pre>
        </div>

        <h3 className="text-h2 mb-4">Код для использования</h3>
        <pre className="bg-mono-100 p-4 rounded text-mono-800 overflow-auto text-sm">
{`// Пример с ${scrollable ? 'фиксированной шириной (scrollable)' : 'растягивающимися колонками'}
<Table
  data={products}
  columns={columns}
  sortState={sortState}
  onSort={handleSort}
  scrollable={${scrollable}}
  className="shadow-sm"
/>

// Колонки для ${scrollable ? 'скроллируемой таблицы (px)' : 'растягивающейся таблицы (%)'}
const columns = [
  {
    id: 'code',
    header: 'Код',
    accessor: 'code',
    sortable: true,
    width: '${scrollable ? '100px' : '10%'}'
  },
  {
    id: 'name',
    header: 'Наименование',
    accessor: 'name',
    sortable: true,
    width: '${scrollable ? '300px' : '25%'}'
  }
  // ...другие колонки
]`}
        </pre>

        <div className="mt-12">
          <h2 className="text-h2 mb-4">Особенности использования</h2>

          <h3 className="text-b2 mt-8 mb-3">Режим с фиксированной шириной (scrollable: true)</h3>
          <ul className="list-disc pl-6 mb-6 text-b3-regular text-mono-700">
            <li>Ширина колонок задается в пикселях (px)</li>
            <li>При нехватке места появляется горизонтальный скролл</li>
            <li>Заголовок и ячейки имеют строго фиксированную ширину</li>
            <li>Подходит для таблиц с большим количеством столбцов</li>
            <li>Хорошо работает на мобильных устройствах</li>
          </ul>

          <h3 className="text-b2 mt-8 mb-3">Режим с растягивающимися колонками (scrollable: false)</h3>
          <ul className="list-disc pl-6 mb-6 text-b3-regular text-mono-700">
            <li>Ширина колонок задается в процентах (%)</li>
            <li>Колонки растягиваются для заполнения всей ширины контейнера</li>
            <li>Все колонки всегда видны без скролла</li>
            <li>Подходит для таблиц с небольшим количеством столбцов</li>
            <li>Лучше всего выглядит на десктопах и больших экранах</li>
          </ul>

          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mt-8">
            <h4 className="font-medium mb-2">Важное замечание:</h4>
            <p>При использовании режима с растягивающимися колонками (scrollable: false) убедитесь, что сумма ширин всех колонок составляет ровно 100%. В противном случае таблица может отображаться некорректно.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTablePage;
import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { CustomStatus, useCustomStatuses, useDeleteCustomStatus } from '@/entities/customStatus'
import { MoreHoriz, Edit, Delete, Add } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { Typography } from '@/shared/ui/typography'
import { Modal } from '@/shared/ui/modal'
import { notification } from '@/shared/lib/notification'
import { StatusSidebar } from '@/features/admin/ui/StatusSidebar'
import { Control } from '@/shared/ui/controls'

export const StatusesPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    direction: 'asc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<CustomStatus | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: statuses, isLoading, error } = useCustomStatuses()
  const deleteStatusMutation = useDeleteCustomStatus()

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleAddStatus = () => {
    setSelectedStatus(null)
    setIsSidebarOpen(true)
  }

  const handleEditStatus = (status: CustomStatus) => {
    setSelectedStatus(status)
    setIsSidebarOpen(true)
    setOpenDropdownId(null)
  }

  const handleOpenDeleteModal = (status: CustomStatus) => {
    setSelectedStatus(status)
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDeleteStatus = () => {
    if (selectedStatus) {
      deleteStatusMutation.mutate(selectedStatus.id, {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Статус успешно удален'
          })
          setIsDeleteModalOpen(false)
        },
        onError: () => {
          notification.error({
            title: 'Ошибка',
            description: 'Не удалось удалить статус'
          })
        }
      })
    }
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
  }

  const filteredStatuses =
    statuses
      ?.filter((status) => !status.isProtected)
      .filter(
        (status) =>
          searchTerm === '' || status.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []

  const columns = [
    {
      id: 'name',
      header: 'Наименование',
      accessor: 'name',
      sortable: true,
      width: '30%'
    },
    {
      id: 'description',
      header: 'Описание',
      accessor: 'description',
      sortable: true,
      width: '40%'
    },
    {
      id: 'actions',
      header: '',
      width: '10%',
      render: (status: CustomStatus) => {
        const isOpen = openDropdownId === status.id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : status.id)}
              className="!p-2"
              id={`status-actions-${status.id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`status-actions-${status.id}`)}
              position="bottom-right"
              defaultItems={[
                {
                  label: 'Редактировать',
                  icon: <Edit />,
                  onClick: () => handleEditStatus(status)
                }
              ]}
              warningItems={[
                {
                  label: 'Удалить',
                  icon: <Delete />,
                  onClick: () => handleOpenDeleteModal(status)
                }
              ]}
            />
          </div>
        )
      }
    }
  ]

  const emptyComponent = (
    <EmptyMessage
      variant="small"
      imageUrl={EmptyStateSvg}
      title={error ? 'Ошибка загрузки данных' : 'Нет дополнительных статусов'}
      description={
        error
          ? String(error)
          : 'По заданному запросу нет дополнительных статусов, либо их нет в системе'
      }
      className={'my-auto'}
    />
  )

  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка статусов..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h1">Дополнительные статусы</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleAddStatus}>
          Добавить статус
        </Button>
      </div>

      <div className="w-full">
        <Control.Input
          placeholder="Поиск по названию статуса..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : filteredStatuses}
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          loading={isLoading}
          emptyComponent={isLoading ? loadingComponent : emptyComponent}
        />
      </div>

      <StatusSidebar open={isSidebarOpen} onClose={handleCloseSidebar} status={selectedStatus} />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Удаление статуса"
        actions={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteStatus}
              disabled={deleteStatusMutation.isPending}
            >
              {deleteStatusMutation.isPending ? (
                <>
                  <Spinner size="small" variant="white" className="mr-2" />
                  <span>Удаление...</span>
                </>
              ) : (
                'Удалить'
              )}
            </Button>
          </>
        }
      >
        <Typography variant="b3Regular">
          Вы действительно хотите удалить статус "{selectedStatus?.name}"? Это действие нельзя
          отменить.
        </Typography>
      </Modal>
    </div>
  )
}

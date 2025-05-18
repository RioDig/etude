import React, { useState } from 'react'
import { Table, SortState } from '@/widgets/table'
import { Filter, FilterOption } from '@/shared/ui/filter'
import { EmptyMessage } from '@/shared/ui/emptyMessage'
import { Spinner } from '@/shared/ui/spinner'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import {
  CourseTemplate,
  useCourseTemplates,
  useDeleteCourseTemplate
} from '@/entities/courseTemplate'
import { MoreHoriz, Edit, Delete, Add } from '@mui/icons-material'
import EmptyStateSvg from '@/shared/assets/images/empty-states/empty.svg'
import { Typography } from '@/shared/ui/typography'
import { Modal } from '@/shared/ui/modal'
import { notification } from '@/shared/lib/notification'
import { CourseTemplateSidebar } from '@/features/admin/ui/CourseTemplateSidebar'
import { useQueryClient } from '@tanstack/react-query'
import { FilterValue } from '@/entities/filter'
import { CourseTrackLabels } from '@/shared/labels/courseTrack.ts'

export const TemplatesPage: React.FC = () => {
  const [sortState, setSortState] = useState<SortState>({
    field: 'course_template_name',
    direction: 'asc'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CourseTemplate | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data: templates, isLoading, error } = useCourseTemplates()
  const deleteTemplateMutation = useDeleteCourseTemplate()

  const queryClient = useQueryClient()

  const filterOptions: FilterOption[] = [
    {
      id: 'name',
      label: 'Наименование',
      type: 'dropdown',
      options: [{ value: '', label: 'Все курсы' }]
    },
    {
      id: 'type',
      label: 'Тип',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все типы' },
        { value: 'Course', label: 'Курс' },
        { value: 'Conference', label: 'Конференция' },
        { value: 'Certification', label: 'Сертификация' },
        { value: 'Workshop', label: 'Мастер-класс' }
      ]
    },
    {
      id: 'format',
      label: 'Формат',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все форматы' },
        { value: 'Online', label: 'Онлайн' },
        { value: 'Offline', label: 'Очно' }
      ]
    },
    {
      id: 'track',
      label: 'Направление',
      type: 'dropdown',
      options: [
        { value: '', label: 'Все направления' },
        { value: 'HardSkills', label: 'Hard Skills' },
        { value: 'SoftSkills', label: 'Soft Skills' },
        { value: 'ManagementSkills', label: 'Management Skills' }
      ]
    }
  ]

  const handleFilterChange = (_filterId: string, value: FilterValue) => {
    if (value === '') {
      queryClient.invalidateQueries({ queryKey: ['courseTemplates'] })
    }
  }

  const handleResetFilters = () => {
    queryClient.invalidateQueries({ queryKey: ['courseTemplates'] })
  }

  const handleSort = (newSortState: SortState) => {
    setSortState(newSortState)
  }

  const handleAddTemplate = () => {
    setSelectedTemplate(null)
    setIsSidebarOpen(true)
  }

  const handleEditTemplate = (template: CourseTemplate) => {
    setSelectedTemplate(template)
    setIsSidebarOpen(true)
    setOpenDropdownId(null)
  }

  const handleOpenDeleteModal = (template: CourseTemplate) => {
    setSelectedTemplate(template)
    setIsDeleteModalOpen(true)
    setOpenDropdownId(null)
  }

  const handleDeleteTemplate = () => {
    if (selectedTemplate) {
      deleteTemplateMutation.mutate(selectedTemplate.course_template_id, {
        onSuccess: () => {
          notification.success({
            title: 'Успешно',
            description: 'Мероприятие успешно удалено'
          })
          setIsDeleteModalOpen(false)
        },
        onError: () => {
          notification.error({
            title: 'Ошибка',
            description: 'Не удалось удалить мероприятие'
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

  const columns = [
    {
      id: 'course_template_type',
      header: 'Тип',
      accessor: 'course_template_type',
      sortable: true,
      width: '10%',
      render: (template: CourseTemplate) => {
        const typeMap: Record<string, string> = {
          Course: 'Курс',
          Conference: 'Конференция',
          Certification: 'Сертификация',
          Workshop: 'Мастер-класс'
        }
        return typeMap[template.course_template_type] || template.course_template_type
      }
    },
    {
      id: 'course_template_name',
      header: 'Наименование',
      accessor: 'course_template_name',
      sortable: true,
      width: '25%'
    },
    {
      id: 'course_template_format',
      header: 'Формат',
      accessor: 'course_template_format',
      sortable: true,
      width: '10%',
      render: (template: CourseTemplate) => {
        const formatMap: Record<string, string> = {
          Online: 'Онлайн',
          Offline: 'Очно'
        }
        return formatMap[template.course_template_format] || template.course_template_format
      }
    },
    {
      id: 'course_template_track',
      header: 'Направление',
      accessor: 'course_template_track',
      sortable: true,
      width: '15%',
      render: (template: CourseTemplate) => {
        return CourseTrackLabels[template.course_template_track]
      }
    },
    {
      id: 'course_template_trainingCenter',
      header: 'Центр обучения',
      sortable: true,
      width: '20%',
      render: (template: CourseTemplate) => template.course_template_trainingCenter || '—'
    },
    {
      id: 'course_template_startDate',
      header: 'Дата начала',
      sortable: true,
      width: '10%',
      render: (template: CourseTemplate) => {
        if (!template.course_template_startDate) return '—'
        return new Date(template.course_template_startDate).toLocaleDateString('ru-RU')
      }
    },
    {
      id: 'actions',
      header: '',
      width: '5%',
      render: (template: CourseTemplate) => {
        const isOpen = openDropdownId === template.course_template_id

        return (
          <div className="relative">
            <Button
              variant="third"
              onClick={() => setOpenDropdownId(isOpen ? null : template.course_template_id)}
              className="!p-2"
              id={`template-actions-${template.course_template_id}`}
            >
              <MoreHoriz />
            </Button>

            <DropdownMenu
              open={isOpen}
              onClose={() => setOpenDropdownId(null)}
              anchorEl={document.getElementById(`template-actions-${template.course_template_id}`)}
              position="bottom-right"
              defaultItems={[
                {
                  label: 'Редактировать',
                  icon: <Edit />,
                  onClick: () => handleEditTemplate(template)
                }
              ]}
              warningItems={[
                {
                  label: 'Удалить',
                  icon: <Delete />,
                  onClick: () => handleOpenDeleteModal(template)
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
      title={error ? 'Ошибка загрузки данных' : 'Нет мероприятий'}
      description={
        error ? String(error) : 'По заданным фильтрам нет мероприятий, либо их нет в системе'
      }
      className={'my-auto'}
    />
  )

  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Spinner size="large" label="Загрузка мероприятий..." />
    </div>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <Typography variant={'h1'}>Мероприятия</Typography>
        <Button variant="primary" leftIcon={<Add />} onClick={handleAddTemplate}>
          Добавить мероприятие
        </Button>
      </div>

      <Filter
        filters={filterOptions}
        pageId="admin-templates"
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex-1 overflow-hidden">
        <Table
          data={isLoading ? [] : templates || []}
          columns={columns}
          sortState={sortState}
          onSort={handleSort}
          loading={isLoading}
          emptyComponent={isLoading ? loadingComponent : emptyComponent}
        />
      </div>

      <CourseTemplateSidebar
        open={isSidebarOpen}
        onClose={handleCloseSidebar}
        template={selectedTemplate}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Удаление мероприятия"
        actions={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteTemplate}
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending ? (
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
          Вы действительно хотите удалить мероприятие "{selectedTemplate?.course_template_name}"?
          Это действие нельзя отменить.
        </Typography>
      </Modal>
    </div>
  )
}

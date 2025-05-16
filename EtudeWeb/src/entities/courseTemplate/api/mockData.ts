import { CourseTemplate } from '@/shared/types'

export const MOCK_COURSE_TEMPLATES: CourseTemplate[] = [
  {
    course_template_id: '1',
    course_template_name: 'JavaScript для начинающих',
    course_template_description: 'Курс для тех, кто хочет освоить основы JavaScript',
    course_template_type: 'Course',
    course_template_track: 'Hard Skills',
    course_template_format: 'Online',
    course_template_trainingCenter: 'ТехноУчебка',
    course_template_startDate: '2025-06-01',
    course_template_endDate: '2025-07-15',
    course_template_link: 'https://technolearn.example/js-basics'
  },
  {
    course_template_id: '2',
    course_template_name: 'Эффективные коммуникации',
    course_template_description: 'Тренинг по развитию коммуникативных навыков',
    course_template_type: 'Workshop',
    course_template_track: 'Soft Skills',
    course_template_format: 'Offline',
    course_template_trainingCenter: 'ЦентрРазвития',
    course_template_startDate: '2025-05-10',
    course_template_endDate: '2025-05-12',
    course_template_link: 'Москва, ул. Академика Королева, 12'
  },
  {
    course_template_id: '3',
    course_template_name: 'DevOps Конференция 2025',
    course_template_description: 'Ежегодная конференция по DevOps практикам',
    course_template_type: 'Conference',
    course_template_track: 'Hard Skills',
    course_template_format: 'Offline',
    course_template_trainingCenter: 'ИТ-Форум',
    course_template_startDate: '2025-09-15',
    course_template_endDate: '2025-09-17',
    course_template_link: 'Санкт-Петербург, КЦ "Экспофорум"'
  },
  {
    course_template_id: '4',
    course_template_name: 'AWS Solution Architect',
    course_template_description: 'Подготовка к сертификации AWS Solution Architect Associate',
    course_template_type: 'Certification',
    course_template_track: 'Hard Skills',
    course_template_format: 'Online',
    course_template_trainingCenter: 'AWS Training',
    course_template_startDate: '2025-07-01',
    course_template_endDate: '2025-08-15',
    course_template_link: 'https://aws-train.example/solution-architect'
  },
  {
    course_template_id: '5',
    course_template_name: 'Управление проектами по методологии Agile',
    course_template_description: 'Практический курс по внедрению Agile в проектах',
    course_template_type: 'Course',
    course_template_track: 'Management Skills',
    course_template_format: 'Online',
    course_template_trainingCenter: 'PMI Russia',
    course_template_startDate: '2025-04-05',
    course_template_endDate: '2025-05-10',
    course_template_link: 'https://pmi-russia.example/agile'
  }
]

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

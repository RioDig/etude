import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import cn from "classnames";
import styles from "../CalendarCard/styles.module.scss";
import { Hint } from "../Hint";

export enum CourseCompetence {
  manage = 'manage',
  soft = 'soft',
  hard = 'hard',
}

export enum CourseFormat {
  fullTime = 'fullTime',
  partTime = 'partTime',
}


interface ICalendarCard {
  competence: CourseCompetence;
  format: CourseFormat;
  title: string;
  onClick?: () => void;
  className?: string;
  CardIcon?: OverridableComponent<SvgIconTypeMap>;
}

export const CalendarCard = ({
  competence,
  format,
  title,
  className,
  onClick,
  CardIcon,
}: ICalendarCard) => {
  const calendarCardClassName = cn(
    styles.root,
    {
      [styles.manage]: competence === CourseCompetence.manage,
      [styles.soft]: competence === CourseCompetence.soft,
      [styles.hard]: competence === CourseCompetence.hard,
    },
    className,
  )

  const competenceName = {
    [CourseCompetence.manage]: 'Manage',
    [CourseCompetence.soft]: 'Soft Skills',
    [CourseCompetence.hard]: 'Hard Skills',
  }[competence]

  const formatName = {
    [CourseFormat.fullTime]: 'очный',
    [CourseFormat.partTime]: 'заочный',
  }[format]

  const card = (
    <div className={calendarCardClassName} onClick={onClick}>
      <span className={styles.icon}>
        {CardIcon && <CardIcon fontSize={'small'} />}
      </span>
      <span className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>
        {
          [
            competenceName,
            formatName,
          ].join(', ')
        }
        </span>
      </span>
    </div>
  )

  return (
    <Hint
      badges={[
        { text: competenceName },
        { text: formatName[0].toUpperCase() + formatName.slice(1) }
      ]}
      title={title}
      description={""}
    >
      {card}
    </Hint>
  )
}

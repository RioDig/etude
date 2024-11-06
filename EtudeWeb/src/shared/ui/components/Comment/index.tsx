import cn from "classnames";
import styles from './styles.module.scss';

export enum CommentType {
  accept = 'accept',
  deny = 'deny',
}

interface IComment {
  type?: CommentType;
  title: string;
  fullName: string;
  position?: string;
  commentText: string;
  className?: string;
}

export const Comment = ({
  type = CommentType.accept,
  title,
  fullName,
  position,
  commentText,
  className,
}: IComment) => {
  const commentClassName = cn(
    styles.root,
    {
      [styles.accept]: type === CommentType.accept,
      [styles.deny]: type === CommentType.deny,
    },
    className,
  )

  return (
    <div className={commentClassName}>
      <div className={"flex flex-col items-start text-start"}>
        <div className={`font-bold text-base ${styles.commentTitle}`}>
          {title}
        </div>
        <div className={"font-semibold text-base flex flex-col gap-1"}>
          {fullName}
          {position &&
            <span className={"font-normal text-gray-300 text-base"}>
              {position}
            </span>
          }
        </div>
      </div>
      <p className={"font-normal text-gray-900 text-base text-start"}>
        {commentText}
      </p>
    </div>
  )
}
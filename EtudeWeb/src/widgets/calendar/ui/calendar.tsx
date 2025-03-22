import styles from './styles.module.scss'
import clsx from 'clsx'

// const MonthView = ({ days, events }) => {
//   return (
//     <div className={styles.monthView}>
//       {days.map((day, index) => (
//         <div key={index} className={styles.dayColumn}>
//           <div className={styles.dayHeader}>{day.date}</div>
//
//           {events.map((event, index) => (
//             <EventCard key={index} event={event} />
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }
//
// // Пример массива days для месяца с 31 днем
// const days = Array.from({ length: 31 }, (_, i) => ({ date: i + 1 }));
//
// // Пример массива events
// const events = [
//   { title: 'Eve1', startDay: 1, duration: 3 },
//   { title: 'Eve 2', startDay: 5, duration: 2 },
//   { title: 'Eve3', startDay: 10, duration: 5 },
// ];
//
// const EventCard = ({ event }) => {
//   return (
//     <div
//       className={styles.eventCard}
//       style={{
//         gridColumnStart: event.startDay,
//         gridColumnEnd: event.startDay + event.duration + 1,
//       }}
//     >
//       {event.title}
//     </div>
//   );
// };
//
// const Calendar = () => {
//   return (
//     <div className={""}>
//       <MonthView days={days} events={events} />
//     </div>
//   )
// }
//
// export default Calendar;

interface EventType {
  eventName: string,
  startDate: number,
  endDate: number,
  duration: number,
}

// const mockEvents: Array<EventType> = [
//   {
//     eventName: 'event1',
//     startDate: 2,
//     endDate: 5,
//     duration: 5 - 2 + 1,
//   },
//   {
//     eventName: 'event2',
//     startDate: 7,
//     endDate: 10,
//     duration: 10 - 7 + 1,
//   },
//   {
//     eventName: 'event3',
//     startDate: 1,
//     endDate: 3,
//     duration: 3 - 1 + 1,
//   },
//   {
//     eventName: 'event4',
//     startDate: 5,
//     endDate: 6,
//     duration: 6 - 5 + 1,
//   },
//   {
//     eventName: 'event5',
//     startDate: 4,
//     endDate: 7,
//     duration: 7 - 4 + 1,
//   },
// ]

const mockEvents: Array<EventType> = [
  {
    eventName: 'event1',
    startDate: 3,
    endDate: 7,
    duration: 5,
  },
  {
    eventName: 'event2',
    startDate: 2,
    endDate: 5,
    duration: 4,
  },
  {
    eventName: 'event3',
    startDate: 6,
    endDate: 8,
    duration: 3,
  },
  {
    eventName: 'event4',
    startDate: 1,
    endDate: 2,
    duration: 2,
  },
]

const sortEvents = (events: Array<EventType>) => {
  return events.sort((a, b) => {
    if (a.duration > b.duration) return -1
    if (a.duration < b.duration) return 1
    return 0
  })
}

const tempDays = 8;

const distributeEvents = (events: Array<EventType>) => {
  let matrix = [];
  let lineCounter = 1;
  let durationsArray: Array<Array<number>> = []

  events.forEach(event => {
    if (lineCounter === 1) {
      matrix.push([event])
      durationsArray.push([Math.abs(1 - event.startDate), tempDays - event.endDate])
      lineCounter++
      events.shift()
      return
    }

    //TODO: Ищем в durationsArray значение duration текущего event. Если нашли, то убираем его из durationsArray и делаем push в matrix


  })
  return events;
}

console.log(distributeEvents(sortEvents(mockEvents)))

const Calendar = () => {
  return (
    <div className={clsx("gap-1 border-2 border-dashed", styles.mainDiv)}>
      <div className={""}>
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
      </div>
      <div>
        {mockEvents.map((event) => (
          <div className={`col-start-${event.startDate} col-end-${event.endDate + 1}`}>{event.eventName} {event.duration}</div>
        ))}
      </div>
      <div>
        <div className={"col-start-2 col-end-4"}>test1</div>
        <div className={"col-start-6 col-end-7"}>test2</div>
        <div className={"col-start-8 col-end-10"}>test3</div>
      </div>
      <div>
        <div className={"col-start-1 col-end-4"}>test1</div>
        <div className={"col-start-5 col-end-6"}>test2</div>
        <div className={"col-start-7 col-end-9"}>test3</div>
      </div>
      <div>
        <div className={"col-start-1 col-end-2"}>test1</div>
        <div className={"col-start-3 col-end-6"}>test2</div>
        <div className={"col-start-7 col-end-11"}>test3</div>
      </div>
    </div>
  )
}

export default Calendar;
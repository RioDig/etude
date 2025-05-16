import { Counter } from '@/shared/ui/counter'
import { Typography } from '@/shared/ui/typography'

const TestCounterPage = () => {
  return (
    <div className="">
      <Typography variant={'h2Regular'} className="mb-2">
        Пример использования &lt;Counter/&gt;
      </Typography>
      <div className="flex gap-2 justify-center">
        <Counter value={23} />
        <Counter value={145} />
        <Counter value={8465432342} />
      </div>
    </div>
  )
}

export default TestCounterPage

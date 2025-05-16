import { Badge } from '@/shared/ui/badge'
import { ExpandMore, ExpandLess, CheckCircle } from '@mui/icons-material'

const TestBadgePage = () => {
  return (
    <div className="flex flex-col items-start gap-6 p-6 bg-mono-50">
      <div className="text-b3-semibold">Badge Component</div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-4">
          <div className="w-20 text-right text-b4">Default:</div>
          <Badge>Label</Badge>
          <Badge leftIcon={<ExpandMore />}>With Left Icon</Badge>
          <Badge rightIcon={<ExpandLess />}>With Right Icon</Badge>
          <Badge leftIcon={<ExpandMore />} rightIcon={<ExpandLess />}>
            Both Icons
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 text-right text-b4">Error:</div>
          <Badge variant="error">Label</Badge>
          <Badge variant="error" leftIcon={<ExpandMore />}>
            With Left Icon
          </Badge>
          <Badge variant="error" rightIcon={<CheckCircle />}>
            With Right Icon
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 text-right text-b4">Warning:</div>
          <Badge variant="warning">Label</Badge>
          <Badge variant="warning" leftIcon={<ExpandMore />}>
            With Left Icon
          </Badge>
          <Badge variant="warning" rightIcon={<CheckCircle />}>
            With Right Icon
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 text-right text-b4">Success:</div>
          <Badge variant="success">Label</Badge>
          <Badge variant="success" leftIcon={<CheckCircle />}>
            With Left Icon
          </Badge>
          <Badge variant="success" rightIcon={<ExpandLess />}>
            With Right Icon
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-20 text-right text-b4">System:</div>
          <Badge variant="system">Label</Badge>
          <Badge variant="system" leftIcon={<ExpandMore />}>
            With Left Icon
          </Badge>
          <Badge variant="system" rightIcon={<CheckCircle />}>
            With Right Icon
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default TestBadgePage

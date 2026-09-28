import Badge from './Badge'

export function BadgeEvaluations({ status }) {
  const colorMap = {
    submitted: 'success',
    draft: 'warning',
  }

  const labelMap = {
    submitted: 'Submitted',
    draft: 'Draft',
  }

  return <Badge value={status} colorMap={colorMap} labelMap={labelMap} />
}

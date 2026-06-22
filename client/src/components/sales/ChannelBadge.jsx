import { getCompanyBadgeClass } from '../../utils/companyColors'

export default function ChannelBadge({ channel }) {
  const style = getCompanyBadgeClass(channel)

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide ${style}`}
    >
      {channel}
    </span>
  )
}

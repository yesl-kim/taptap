import { HEIGHT_PER_STEP, STEP } from './timetable.constants'

const cells = Array.from({ length: 24 * (60 / STEP) })

const TimetableGrid = () => (
  <div className="pointer-events-none">
    {cells.map((_, i) => (
      <div
        key={i}
        className="even:border-b-[1px] even:border-gray-200"
        style={{ height: HEIGHT_PER_STEP }}
      />
    ))}
  </div>
)

export default TimetableGrid

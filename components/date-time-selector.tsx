"use client"

interface DateTimeSelectorProps {
  dates: string[]
  times: string[]
  selectedDate: string
  selectedTime: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export default function DateTimeSelector({
  dates,
  times,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
}: DateTimeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Choose date</h3>
        <div className="flex gap-2 flex-wrap">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => onDateChange(date)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedDate === date ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Choose time</h3>
        <div className="flex gap-2 flex-wrap">
          {times.map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              className={`px-4 py-2 rounded font-medium transition-colors ${
                selectedTime === time ? "bg-yellow-400 text-black" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">All times are in IST (GMT +5:30)</p>
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

type Role = "admin" | "user"

interface RoleToggleProps {
  value: Role
  onChange: (value: Role) => void
}

export function RoleToggle({ value, onChange }: RoleToggleProps) {
  return (
    <div className="flex gap-3 w-full">
      <SegmentButton
        label="Admin"
        selected={value === "admin"}
        onClick={() => onChange("admin")}
      />
      <SegmentButton
        label="User"
        selected={value === "user"}
        onClick={() => onChange("user")}
      />
    </div>
  )
}

function SegmentButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <Button
    variant={selected ? "ghost" : "outline"}
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center gap-2 rounded-md border px-6 py-3 transition-all w-full",
        selected
          ? "border-black bg-gray-50"
          : "border-gray-300 bg-white hover:bg-gray-50"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-full border transition-all",
          selected ? "border-gray-200" : "border-gray-400"
        )}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-black" />}
      </span>

      <span
        className={cn(
          "font-medium text-sm",
          selected ? "text-black" : "text-gray-600"
        )}
      >
        {label}
      </span>
    </Button>
  )
}

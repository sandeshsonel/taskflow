import { Bell } from "lucide-react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const Notification = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <Bell className='size-[1.2rem] scale-100' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className="min-w-[350px] min-h-[300px]">
        <DropdownMenuItem>
          
        </DropdownMenuItem>
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Notification
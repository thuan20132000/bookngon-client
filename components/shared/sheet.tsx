import { Staff } from "@/types/booking";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { StaffItem } from "./item";


const BUSINESS_STAFFS: Staff[] = [
  {
    "id": 14,
    "first_name": "Julies",
    "last_name": "Truog",
    "email": "",
    "phone": "",
    "role": 5,
    "role_name": "Technician",
    "is_active": true,
    "created_at": "2025-11-19T19:31:49.482156Z",
    "photo": null
  },
  {
    "id": 16,
    "first_name": "Ethan",
    "last_name": "Tr",
    "email": "",
    "phone": "",
    "role": 5,
    "role_name": "Technician",
    "is_active": true,
    "created_at": "2025-11-20T01:34:22.309051Z",
    "photo": null
  },
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.431154Z",
    "photo": null
  },
  {
    "id": 5,
    "first_name": "Jill",
    "last_name": "Doe",
    "email": "jill.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.434511Z",
    "photo": null
  },
  {
    "id": 4,
    "first_name": "Jill",
    "last_name": "Doe",
    "email": "jill.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.433715Z",
    "photo": null
  },
  {
    "id": 15,
    "first_name": "Bryan",
    "last_name": "Nguyen",
    "email": "",
    "phone": "",
    "role": 5,
    "role_name": "Technician",
    "is_active": true,
    "created_at": "2025-11-19T19:32:12.978476Z",
    "photo": null
  },
  {
    "id": 3,
    "first_name": "Jack",
    "last_name": "Doe",
    "email": "jack.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.432946Z",
    "photo": null
  },
  {
    "id": 6,
    "first_name": "Jill",
    "last_name": "Doe",
    "email": "jill.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.435251Z",
    "photo": null
  },
  {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jill.doe@example.com",
    "phone": "1234567890",
    "role": 2,
    "role_name": "Manager",
    "is_active": true,
    "created_at": "2025-11-19T06:42:03.432236Z",
    "photo": null
  }
]


interface StaffRequestSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStaffSelect?: (staff: Staff) => void;
}

export const StaffRequestSheet = ({ open, onOpenChange, onStaffSelect }: StaffRequestSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Staff Request</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          Please select the staff you would like to request.
        </SheetDescription>
        <div className="h-full overflow-y-auto flex flex-col gap-2">
          {BUSINESS_STAFFS.map((staff) => (
            <StaffItem
              key={staff.id}
              staff={staff}
              selected={false}
              onSelect={onStaffSelect}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
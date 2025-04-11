import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseCSV } from '@/utils/dataService';
import DoctorsData from '@/assets/Doctors.csv?raw';

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (appointmentDetails: AppointmentDetails) => void;
}

export interface AppointmentDetails {
  name: string;
  email: string;
  phone: string;
  date: Date | undefined;
  time: string;
  dentist: string;
  reason: string;
}

const APPOINTMENT_TIMES = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

const APPOINTMENT_REASONS = [
  "Regular Checkup",
  "Cleaning",
  "Tooth Pain",
  "Filling",
  "Root Canal",
  "Crown",
  "Extraction",
  "Consultation",
  "Other"
];

const AppointmentModal: React.FC<AppointmentModalProps> = ({ 
  open, 
  onOpenChange,
  onSchedule
}) => {
  const [appointmentDetails, setAppointmentDetails] = useState<AppointmentDetails>({
    name: '',
    email: '',
    phone: '',
    date: undefined,
    time: '',
    dentist: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dentists, setDentists] = useState<string[]>([]);

  useEffect(() => {
    try {
      const doctors = parseCSV(DoctorsData);
      const formattedDentists = doctors.map(doc => 
        `Dr. ${doc['First Name']} ${doc['Last Name']}`
      );
      
      const uniqueDentists = [...new Set(formattedDentists)];
      setDentists(uniqueDentists);
    } catch (error) {
      console.error('Error loading dentists:', error);
      setDentists([
        "Dr. Sarah Johnson",
        "Dr. Michael Chen",
        "Dr. Emily Rodriguez",
        "Dr. James Wilson"
      ]);
    }
  }, []);

  const handleChange = (field: keyof AppointmentDetails, value: string | Date | undefined) => {
    setAppointmentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!appointmentDetails.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!appointmentDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(appointmentDetails.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!appointmentDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!appointmentDetails.date) {
      newErrors.date = "Please select a date";
    }
    
    if (!appointmentDetails.time) {
      newErrors.time = "Please select a time";
    }
    
    if (!appointmentDetails.dentist) {
      newErrors.dentist = "Please select a dentist";
    }
    
    if (!appointmentDetails.reason) {
      newErrors.reason = "Please select a reason";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSchedule(appointmentDetails);
      setAppointmentDetails({
        name: '',
        email: '',
        phone: '',
        date: undefined,
        time: '',
        dentist: '',
        reason: ''
      });
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    handleChange('date', date);
    setCalendarOpen(true);
  };

  const disabledDays = [
    new Date(2025, 3, 12),
    new Date(2025, 3, 13),
    { from: new Date(2025, 3, 20), to: new Date(2025, 3, 25) }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => {
        if (calendarOpen) {
          e.preventDefault();
        }
      }}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-dental-dark-blue">Schedule Your Dental Appointment</DialogTitle>
            <DialogDescription>
              Complete the form below to book your appointment. We'll send a confirmation email with the details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={appointmentDetails.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={appointmentDetails.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={appointmentDetails.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={errors.date ? "text-destructive" : ""}>
                  Date
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !appointmentDetails.date && "text-muted-foreground",
                        errors.date && "border-destructive"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {appointmentDetails.date ? (
                        format(appointmentDetails.date, "PPP")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <Calendar
                      mode="single"
                      selected={appointmentDetails.date}
                      onSelect={handleCalendarSelect}
                      disabled={(date) => 
                        date < new Date() || 
                        date.getDay() === 0 || 
                        date.getDay() === 6 || 
                        disabledDays.some(disabledDay => 
                          disabledDay instanceof Date 
                            ? date.toDateString() === disabledDay.toDateString()
                            : 'from' in disabledDay && 'to' in disabledDay
                              ? date >= disabledDay.from && date <= disabledDay.to
                              : false
                        )
                      }
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className={errors.time ? "text-destructive" : ""}>
                  Time
                </Label>
                <Select
                  value={appointmentDetails.time}
                  onValueChange={(value) => handleChange('time', value)}
                >
                  <SelectTrigger className={errors.time ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TIMES.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={errors.dentist ? "text-destructive" : ""}>
                  Dentist
                </Label>
                <Select
                  value={appointmentDetails.dentist}
                  onValueChange={(value) => handleChange('dentist', value)}
                >
                  <SelectTrigger className={errors.dentist ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select dentist" />
                  </SelectTrigger>
                  <SelectContent>
                    {dentists.map(dentist => (
                      <SelectItem key={dentist} value={dentist}>
                        {dentist}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dentist && <p className="text-xs text-destructive">{errors.dentist}</p>}
              </div>
              
              <div className="space-y-2">
                <Label className={errors.reason ? "text-destructive" : ""}>
                  Reason
                </Label>
                <Select
                  value={appointmentDetails.reason}
                  onValueChange={(value) => handleChange('reason', value)}
                >
                  <SelectTrigger className={errors.reason ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_REASONS.map(reason => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-xs text-destructive">{errors.reason}</p>}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-dental-teal hover:bg-dental-teal/90"
            >
              Schedule Appointment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;

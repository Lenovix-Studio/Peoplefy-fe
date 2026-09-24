"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col gap-4",
        month: "space-y-4",
        month_caption: "flex items-center justify-center h-8 relative",
        caption_label: "hidden",
        dropdowns: "flex items-center justify-center gap-1.5 z-10",
        dropdown: "relative inline-flex items-center",
        dropdown_root:
          "text-xs font-medium bg-background border border-border rounded-md px-2 py-1 cursor-pointer hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs",
        nav: "flex items-center justify-between absolute inset-x-0 top-0 h-8 z-20 pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-background p-0 opacity-80 hover:opacity-100 cursor-pointer shadow-2xs pointer-events-auto",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-background p-0 opacity-80 hover:opacity-100 cursor-pointer shadow-2xs pointer-events-auto",
        ),
        month_grid: "w-full border-collapse space-y-1 mt-2",
        weekdays: "flex w-full justify-between",
        weekday:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-1.5 justify-between",
        day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 cursor-pointer rounded-md hover:bg-accent",
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md font-semibold",
        today: "bg-accent/80 text-accent-foreground font-semibold rounded-md",
        outside: "text-muted-foreground/35 opacity-40",
        disabled: "text-muted-foreground/20 opacity-25 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };

"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomInput = (props: any) => {
  const [isFocused, setFocused] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-center rounded-lg gap-3 h-16 w-full border-2 border-primary bg-primary pr-3 pl-5 py-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        isFocused ? "border-input" : ""
      )}
    >
      {props.icon && props.icon}
      <Input
        ref={props.inputRef && props.inputRef}
        {...props}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className=" text-md border-none rounded-none text-secondary"
      />
    </div>
  );
};

export { CustomInput };

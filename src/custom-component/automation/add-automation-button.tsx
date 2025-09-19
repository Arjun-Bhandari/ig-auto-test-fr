"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TempleteDialog } from "./templete-dailog";

export default function AddautomationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="bg-blue-600 text-white rounded-4xl hover:bg-blue-500"
        onClick={() => setOpen(true)}
      >
        + Add Automation
      </Button>
      <TempleteDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
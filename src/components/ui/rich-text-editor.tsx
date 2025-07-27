import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"

export function RichTextEditor() {
  const [value, setValue] = useState("")

  return (
    <div>
      <div className="flex gap-2 px-2 py-1">
        {/* Bold */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            document.execCommand("bold")
          }}
        >
          <strong>B</strong>
        </Button>
        {/* Italic */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            document.execCommand("italic")
          }}
        >
          <em>I</em>
        </Button>
        {/* Link Insert via Popover + Command */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              🔗
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <Command>
              <CommandInput placeholder="Paste link…" />
              <CommandList>
                <CommandItem>…</CommandItem>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        className="min-h-[200px] p-2 outline-none resize-none"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
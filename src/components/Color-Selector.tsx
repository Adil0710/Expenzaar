import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const colorPalette = [
  { name: "Blue", value: "#0EA5E9" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#D946EF" },
  { name: "Orange", value: "#F97316" },
  { name: "Green", value: "#10B981" },
  { name: "Red", value: "#EF4444" },
];

type ColorSelectorProps = {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
};

const ColorSelector = ({
  value = "#0EA5E9",
  onChange,
  className,
}: ColorSelectorProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(value);
  const [useCustomColor, setUseCustomColor] = useState(
    !colorPalette.some((color) => color.value === value)
  );

  const handleColorChange = (newColor: string) => {
    setSelectedColor(newColor);
    onChange(newColor);
    setUseCustomColor(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChange(newColor);
  };

  return (
    <div className={cn("flex items-center gap-2 w-full mt-1", className)}>
      <RadioGroup
        value={useCustomColor ? "custom" : selectedColor}
        onValueChange={(val) => {
          if (val === "custom") {
            setUseCustomColor(true);
          } else {
            handleColorChange(val);
          }
        }}
        className="flex items-center justify-between w-full"
      >
        {colorPalette.map((color) => (
          <div key={color.value} className="relative">
            <RadioGroupItem
              value={color.value}
              id={color.value}
              className="peer sr-only"
            />
            <Label
              htmlFor={color.value}
              className="block w-6 h-6 rounded-full cursor-pointer border border-gray-200 transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2"
            >
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: color.value }}
              />
            </Label>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] whitespace-nowrap font-medium">
                {color.name}
              </span>
            </div>
          </div>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <div className="relative">
              <RadioGroupItem
                value="custom"
                id="custom-color"
                className="peer sr-only"
              />
              <Label
                htmlFor="custom-color"
                className="flex items-center justify-center w-6 h-6 rounded-full cursor-pointer border border-gray-200 transition-all hover:scale-110 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-offset-2"
              >
                <Palette className="w-3 h-3" />
              </Label>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3" align="start">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: selectedColor }}
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={handleCustomColorChange}
                  className="flex-1"
                  placeholder="#RRGGBB"
                />
              </div>
              <Label htmlFor="color-input" className=" text-xs">
                Click here to select color
              </Label>
              <Input
                id="color-input"
                type="color"
                value={selectedColor}
                onChange={handleCustomColorChange}
                className="w-full h-8 cursor-pointer"
              />
            </div>
          </PopoverContent>
        </Popover>
      </RadioGroup>
    </div>
  );
};

export default ColorSelector;

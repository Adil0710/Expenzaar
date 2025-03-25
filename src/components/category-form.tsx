import React from "react";
import { TabsContent } from "./ui/tabs";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoriesSchema } from "@/schemas/categoriesSchema";

export type CategoriesFormvalues = {
  name: string;
  limit: number;
  icon: string;
  color: string;
};

export default function CategoryForm() {
  const categoriesAdd = useForm<CategoriesFormvalues>({
    resolver: zodResolver(categoriesSchema),
  });
  return (
    <TabsContent value="category">
      <DialogHeader>
        <DialogTitle>Add Category</DialogTitle>
        <DialogDescription>
          Add your category here. Click save when you&apos;re done.
        </DialogDescription>
      </DialogHeader>

      {/* <Form {...profileForm}>
        <form
          className="space-y-6 mt-5"
          onSubmit={profileForm.handleSubmit(onProfileSubmit)}
        >
          <FormField
            control={profileForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                {profileLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <div className="relative">
                    <FormControl className="pl-10">
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                {profileLoading ? (
                  <Skeleton className="w-full h-8" />
                ) : (
                  <div className="relative">
                    <FormControl className="pl-10">
                      <Input
                        type="email"
                        placeholder="m@example.com"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                      />
                    </FormControl>
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel>Salary</FormLabel>
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Popover open={currencyOpen} onOpenChange={setCurrencyOpen}>
                <PopoverTrigger asChild>
                  {profileLoading ? (
                    <Skeleton className="w-[180px] h-8" />
                  ) : (
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={currencyOpen}
                      className="w-[180px] justify-between"
                    >
                      {selectedCurrency ? (
                        <span className="text-ellipsis line-clamp-1">
                          {selectedCurrency.symbol} - {selectedCurrency.name}
                        </span>
                      ) : (
                        <>
                          {" "}
                          <DollarSign /> - &nbsp; Currency{" "}
                        </>
                      )}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  )}
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0">
                  <Command className="overflow-hidden">
                    <CommandInput
                      placeholder="Search currency..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No currency found.</CommandEmpty>
                      <div
                        className="max-h-[300px] overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <CommandGroup>
                          {currencies.map((currency) => (
                            <CommandItem
                              key={currency.code}
                              value={`${currency.name} ${currency.code} ${currency.symbol}`}
                              onSelect={() => {
                                setSelectedCurrency(currency);
                                profileForm.setValue(
                                  "currencySymbol",
                                  currency.symbol
                                );
                                profileForm.clearErrors("currencySymbol");
                                setCurrencyOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCurrency?.code === currency.code
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {currency.symbol} - {currency.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </div>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <FormField
                control={profileForm.control}
                name="salary"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    {profileLoading ? (
                      <Skeleton className="w-full h-8" />
                    ) : (
                      <div className="relative">
                        <FormControl className="pl-10">
                          <Input
                            type="number"
                            placeholder="10000"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            disabled={!selectedCurrency}
                          />
                        </FormControl>
                        <span
                          className={cn(
                            "absolute left-3 top-1/2 transform -translate-y-1/2 text-sm",
                            !selectedCurrency && "text-muted-foreground"
                          )}
                        >
                          {selectedCurrency?.symbol || (
                            <DollarSign className=" h-4 w-4 " />
                          )}
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={profileForm.control}
              name="currencySymbol"
              render={({ field }) => (
                <FormItem className="m-0 p-0">
                  <FormControl>
                    <Input {...field} className="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer [&_svg:not([class*='size-'])]:size-12"
            disabled={profileLoading}
          >
            {profileLoading ? <LoaderLine /> : "Save Changes"}
          </Button>
        </form>
      </Form> */}
    </TabsContent>
  );
}

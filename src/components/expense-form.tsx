import React from "react";
import { TabsContent } from "./ui/tabs";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
export default function ExpenseForm() {
  return (
    <TabsContent value="expense">
      <DialogHeader>
        <DialogTitle>
          {/* {selectedExpense ? "Edit Category" : "Add Expense"} */}
          Add Expense
        </DialogTitle>
        <DialogDescription>
          {/* {selectedExpense
            ? "Edit your category here. Click save when you're done."
            : "Add your category here. Click add when you're done."}{" "} */}
          Add your expense here. Click add when you&apos;re done.
        </DialogDescription>
      </DialogHeader>
    </TabsContent>
  );
}

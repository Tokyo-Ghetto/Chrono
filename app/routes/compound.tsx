"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const formSchema = z.object({
  initialDeposit: z.number().positive({
    message: "Amount must be greater than 0.",
  }),
  monthlyDeposit: z.number().nonnegative({
    message: "Amount cannot be negative.",
  }),
});

export default function Compound() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialDeposit: 10000,
      monthlyDeposit: 0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="m-8 space-y-8 bg-slate-800"
      >
        <FormField
          control={form.control}
          name="initialDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial deposit</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} className="max-w-36" />
              </FormControl>
              <FormDescription>Placeholder description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="monthlyDeposit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly deposit amount</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} className="max-w-36" />
              </FormControl>
              <FormDescription>Placeholder description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

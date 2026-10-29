import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivities } from "./ActivitiesContext";
import { Spinner } from "@/components/ui/spinner";

interface ActivityFormProps {
  onSuccess: () => void;
}

interface FormData {
  title: string;
  estimation: number;
}

const schema = z.object({
  title: z.string().nonempty("Please enter a title"),
  estimation: z.number().positive("Estimation must be at least 1"),
});

export function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addNewActivity } = useActivities();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { estimation: 1, title: "" },
  });

  async function onSubmit(data: FormData) {
    try {
      const { title, estimation } = data;
      setLoading(true);
      await addNewActivity({ title, estimation });
      onSuccess();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-red-300">{errors.title.message}</p>
          )}
        </Field>
        <Field>
          <Label htmlFor="estimation">Estimation</Label>
          <Input
            id="estimation"
            type="number"
            {...register("estimation")}
            min={1}
          />
          {errors.estimation && (
            <p className="text-red-300">{errors.estimation.message}</p>
          )}
        </Field>

        <Field orientation="horizontal">
          <Button type="submit">{loading ? <Spinner /> : "Add"}</Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Field>
        <p className="text-red-300">{error}</p>
      </FieldGroup>
    </form>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivities, type Activity } from "./ActivitiesContext";
import { Spinner } from "@/components/ui/spinner";

interface BaseProps {
  onSuccess: () => void;
}
type ActivityFormProps =
  | (BaseProps & {
      type: "add";
      activity?: never;
    })
  | (BaseProps & { type: "edit"; activity: Activity });

interface FormData {
  title: string;
  estimation: number;
}

const schema = z.object({
  title: z.string().nonempty("Please enter a title"),
  estimation: z.number().positive("Estimation must be at least 1"),
});

export function ActivityForm({ type, onSuccess, activity }: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addActivity, saveActivity } = useActivities();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: activity
      ? { estimation: activity.estimation, title: activity.title }
      : { estimation: 1 },
  });

  async function onSubmit(data: FormData) {
    try {
      const { title, estimation } = data;
      setLoading(true);
      if (type === "add") await addActivity({ title, estimation });
      if (type === "edit") {
        await saveActivity(activity.id, { title, estimation });
      }
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
            {...register("estimation", { valueAsNumber: true })}
            min={1}
          />
          {errors.estimation && (
            <p className="text-red-300">{errors.estimation.message}</p>
          )}
        </Field>

        <Field orientation="horizontal">
          <Button type="submit">
            {loading ? <Spinner /> : type === "add" ? "Add" : "Update"}
          </Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Field>
        <p className="text-red-300">{error}</p>
      </FieldGroup>
    </form>
  );
}

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActivities } from "./ActivitiesContext";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ActivityFormProps {
  onSuccess: () => void;
}

export function ActivityForm({ onSuccess }: ActivityFormProps) {
  const [loading, setLoading] = useState(false);
  const { addNewActivity } = useActivities();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title") as string;
    const estimation = Number(formData.get("estimation"));
    setLoading(true);
    await addNewActivity({ title, estimation });
    setLoading(false);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" />
        </Field>
        <Field>
          <Label htmlFor="estimation">Estimation</Label>
          <Input
            id="estimation"
            name="estimation"
            type="number"
            defaultValue={0}
          />
        </Field>

        <Field orientation="horizontal">
          <Button type="submit">{loading ? <Spinner /> : "Add"}</Button>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
